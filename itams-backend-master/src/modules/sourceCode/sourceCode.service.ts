import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceCode } from 'src/models/entities/sourceCode.entity';
import SourceCodeToUser from 'src/models/entities/sourceCodeToUser.entity';
import { SourceCodeRepository } from 'src/models/repositories/sourceCode.repository';
import { SourceCodeToUserRepository } from 'src/models/repositories/sourceCodeToUser.repository';
import { UsersService } from '../users/users.service';
import { CheckinSourceCodeDto } from './dtos/checkinSourceCode.dto';
import { CheckoutSourceCodeDto } from './dtos/checkoutSourceCode.dto';
import { SourceCodeDto } from './dtos/sourceCode.dto';
import { SourceCodeToUserQueryDto } from './dtos/sourceCodeToUser.dto';

@Injectable()
export class SourceCodeService {
  private logger = new Logger(SourceCodeService.name);

  constructor(
    @InjectRepository(SourceCode)
    private sourceCodeRepo: SourceCodeRepository,
    @InjectRepository(SourceCodeToUser)
    private sourceCodeToUserRepo: SourceCodeToUserRepository,
    private userService: UsersService,
  ) {}

  async getAllSourceCodes() {
    const sourceCodes = await this.sourceCodeRepo.find();
    return sourceCodes;
  }

  async getSourceCodeById(id: number) {
    const sourceCode = await this.sourceCodeRepo.findOneBy({ id });
    return sourceCode;
  }

  async getSourceCodeToUser(
    sourceCodeToUserQueryDto?: SourceCodeToUserQueryDto,
  ) {
    const sourceCodeToUsers = await this.sourceCodeToUserRepo.find({
      relations: {
        sourceCode: true,
        user: true,
      },
      where: {
        sourceCode: { id: sourceCodeToUserQueryDto.sourceCodeId },
        user: { id: sourceCodeToUserQueryDto.userId },
      },
      withDeleted: sourceCodeToUserQueryDto.withDeleted,
    });
    const res = sourceCodeToUsers.map((sourceCodeToUser) => {
      const { sourceCode, user, ...rest } = sourceCodeToUser;
      return {
        ...rest,
        sourceCodeId: sourceCode?.id,
        sourceCodeName: sourceCode?.name,
        userId: user?.id,
        userName: user?.name,
      };
    });
    return res;
  }

  async createNewSourceCode(sourceCodeDto: SourceCodeDto) {
    const sourceCode = Object.assign({}, sourceCodeDto);
    await this.sourceCodeRepo.save(sourceCode);
    return sourceCode;
  }

  async updateSourceCode(id: number, sourceCodeDto: SourceCodeDto) {
    let toUpdate = await this.sourceCodeRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, sourceCodeDto);
    return await this.sourceCodeRepo.save(updated);
  }

  async deleteSourceCode(id: number) {
    const toRemove = await this.sourceCodeRepo.findOneOrFail({
      where: { id },
      relations: { digitalContentToSourceCodes: true, sourceCodeToUsers: true },
    });
    return await this.sourceCodeRepo.softRemove(toRemove);
  }

  /*------------------------ checkin/checkout sourceCode ------------------------- */

  async checkoutSourceCode(checkoutSourceCodeDto: CheckoutSourceCodeDto) {
    if (
      await this.sourceCodeToUserRepo.findOne({
        where: {
          sourceCode: { id: checkoutSourceCodeDto.sourceCodeId },
          user: { id: checkoutSourceCodeDto.userId },
        },
      })
    )
      throw new HttpException(
        'This user is already checkout',
        HttpStatus.BAD_REQUEST,
      );
    const sourceCode = await this.sourceCodeRepo.findOne({
      where: { id: checkoutSourceCodeDto.sourceCodeId },
    });
    const user = await this.userService.getUserById(
      checkoutSourceCodeDto.userId,
    );
    const sourceCodeToUser = new SourceCodeToUser();
    sourceCodeToUser.user = user;
    sourceCodeToUser.sourceCode = sourceCode;
    sourceCodeToUser.start_date = checkoutSourceCodeDto.start_date;
    sourceCodeToUser.start_note = checkoutSourceCodeDto.start_note;
    await this.sourceCodeToUserRepo.save(sourceCodeToUser);
    return sourceCodeToUser;
  }

  async checkinSourceCode(checkinSourceCodeDto: CheckinSourceCodeDto) {
    const sourceCodeToUser = await this.sourceCodeToUserRepo.findOneBy({
      id: checkinSourceCodeDto.sourceCodeToUserId,
    });
    sourceCodeToUser.end_date = checkinSourceCodeDto.end_date;
    sourceCodeToUser.end_note = checkinSourceCodeDto.end_note;
    await this.sourceCodeToUserRepo.save(sourceCodeToUser);
    await this.sourceCodeToUserRepo.softDelete({
      id: checkinSourceCodeDto.sourceCodeToUserId,
    });
    return sourceCodeToUser;
  }
}
