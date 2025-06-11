import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import SoftwareUpdate from 'src/models/entities/softwareUpdate.entity';
import License from 'src/models/entities/license.entity';
import { CreateSoftwareUpdateDto } from './dtos/createSoftwareUpdate.dto';
import { UpdateSoftwareUpdateDto } from './dtos/updateSoftwareUpdate.dto';
import SoftwareDependency from 'src/models/entities/softwareDependency.entity';
import LicenseToAsset from 'src/models/entities/licenseToAsset.entity';
import AssetToUser from 'src/models/entities/assetToUser.entity';
import { MailService } from '../mail/mail.service';
import UserEntity from 'src/models/entities/user.entity';

@Injectable()
export class SoftwareUpdateService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SoftwareUpdate)
    private readonly updateRepo: Repository<SoftwareUpdate>,
    @InjectRepository(License)
    private readonly licenseRepo: Repository<License>,
    @InjectRepository(SoftwareDependency)
    private readonly depRepo: Repository<SoftwareDependency>,
    @InjectRepository(LicenseToAsset)
    private readonly licenseToAssetRepo: Repository<LicenseToAsset>,
    @InjectRepository(AssetToUser)
    private readonly assetToUserRepo: Repository<AssetToUser>,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateSoftwareUpdateDto): Promise<SoftwareUpdate> {
    const license = await this.licenseRepo.findOneBy({ id: dto.licenseId });
    if (!license) throw new NotFoundException('Software not found');

    const toSave = this.updateRepo.create({
      license,
      version: dto.version,
      release_date: dto.release_date,
      note: dto.note,
    });
    const saved = await this.updateRepo.save(toSave);
    const latest = await this.updateRepo.findOne({
      where: { license: { id: license.id } },
      order: { release_date: 'DESC' },
    });

    if (latest && saved.id === latest.id) {
      license.version = saved.version;
      const updatedLicense = await this.licenseRepo.save(license);
      await this.notifyLicenseUpdate(updatedLicense);
    }

    return saved;
  }

  private async notifyLicenseUpdate(license: License) {
    const outgoingDepsRaw = await this.depRepo.find({
      where: { license: { id: license.id } },
      relations: ['dependency'],
    });
    const outgoingDeps = outgoingDepsRaw.map((ent) => ({
      name: ent.dependency.name,
      version: ent.dependency.version,
    }));

    const incomingDepsRaw = await this.depRepo.find({
      where: { dependency: { id: license.id } },
      relations: ['license'],
    });
    const incomingDeps = incomingDepsRaw.map((ent) => ({
      name: ent.license.name,
      version: ent.license.version,
    }));

    const checkedOutRows = await this.licenseToAssetRepo.find({
      where: {
        license: { id: license.id },
        checkin_date: IsNull(), // still checked out
      },
      relations: ['asset'],
    });

    const notifiedUserIds = new Set<number>();

    for (const lta of checkedOutRows) {
      const assetId = lta.asset.id;
      const atu = await this.assetToUserRepo.findOne({
        where: {
          asset: { id: assetId },
          checkin_date: IsNull(),
        },
        relations: ['user'],
      });

      if (atu && atu.user && !notifiedUserIds.has(atu.user.id)) {
        notifiedUserIds.add(atu.user.id);
        let userEntity: UserEntity;
        if ((atu.user as any).email) {
          userEntity = atu.user as UserEntity;
        } else {
          userEntity = await this.dataSource
            .getRepository(UserEntity)
            .findOneBy({ id: atu.user.id });
          if (!userEntity) continue;
        }

        await this.mailService.sendLicenseUpdate(
          userEntity,
          license,
          outgoingDeps,
          incomingDeps,
        );
      }
    }
  }

  async findAllBySoftware(licenseId: number): Promise<SoftwareUpdate[]> {
    return this.updateRepo.find({
      where: { license: { id: licenseId } },
      order: { release_date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SoftwareUpdate> {
    const upd = await this.updateRepo.findOne({
      where: { id },
      relations: ['license'],
    });
    if (!upd) throw new NotFoundException('Update not found');
    return upd;
  }

  async update(
    id: number,
    dto: UpdateSoftwareUpdateDto,
  ): Promise<SoftwareUpdate> {
    const existing = await this.findOne(id);

    if (dto.version !== undefined) existing.version = dto.version;
    if (dto.release_date !== undefined) existing.release_date = dto.release_date;
    if (dto.note !== undefined) existing.note = dto.note;

    const saved = await this.updateRepo.save(existing);

    const latest = await this.updateRepo.findOne({
      where: { license: { id: existing.license.id } },
      order: { release_date: 'DESC' },
    });

    if (latest && saved.id === latest.id) {
      const license = await this.licenseRepo.findOneBy({ id: existing.license.id });
      if (license) {
        license.version = saved.version;
        await this.licenseRepo.save(license);
      }
    }

    return saved;
  }

  async remove(id: number): Promise<void> {
    const upd = await this.findOne(id);
    await this.updateRepo.softRemove(upd);
  }
}
