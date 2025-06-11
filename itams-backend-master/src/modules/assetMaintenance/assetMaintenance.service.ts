import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetMaintenance } from 'src/models/entities/assetMaintenance.entity';
import { AssetMaintenanceRepository } from 'src/models/repositories/assetMaintenance.repository';
import { AssetService } from '../asset/asset.service';
import { SupplierService } from '../supplier/supplier.service';
import { AssetMaintenanceDto } from './dtos/assetMaintenance.dto';
import { AssetMaintenanceQueryDto } from './dtos/assetMaintenanceQuery.dto';

@Injectable()
export class AssetMaintenanceService {
  private logger = new Logger(AssetMaintenanceService.name);

  constructor(
    @InjectRepository(AssetMaintenance)
    private assetMaintenanceRepo: AssetMaintenanceRepository,
    private assetService: AssetService,
    private supplierService: SupplierService,
  ) {}

  async getAllAssetMaintenances(
    assetMaintenanceQueryDto?: AssetMaintenanceQueryDto,
  ) {
    const assetMaintenances = await this.assetMaintenanceRepo.find({
      relations: { asset: true, supplier: true },
      where: {
        asset: { id: assetMaintenanceQueryDto.assetId },
      },
    });
    const res = assetMaintenances.map((assetMaintenance) => {
      const { asset, supplier, ...rest } = assetMaintenance;
      return {
        ...rest,
        asset_id: asset?.id,
        asset_name: asset?.name,
        supplier: supplier?.name,
      };
    });
    return res;
  }

  async getAssetMaintenanceById(id: number) {
    const assetMaintenance = await this.assetMaintenanceRepo.findOneBy({ id });
    return assetMaintenance;
  }

  async createNewAssetMaintenance(assetMaintenanceDto: AssetMaintenanceDto) {
    const supplier = await this.supplierService.getSupplierById(
      assetMaintenanceDto.supplierId,
    );
    const asset = await this.assetService.getAssetById(
      assetMaintenanceDto.assetId,
    );
    const assetMaintenance = new AssetMaintenance();
    assetMaintenance.start_date = assetMaintenanceDto.start_date;
    assetMaintenance.end_date = assetMaintenanceDto.end_date;
    assetMaintenance.cost = assetMaintenanceDto.cost;
    assetMaintenance.note = assetMaintenanceDto.note;
    assetMaintenance.asset = asset;
    assetMaintenance.supplier = supplier;

    await this.assetMaintenanceRepo.save(assetMaintenance);
    return assetMaintenance;
  }

  async updateAssetMaintenance(
    id: number,
    assetMaintenanceDto: AssetMaintenanceDto,
  ) {
    let toUpdate = await this.assetMaintenanceRepo.findOneBy({ id });
    let { assetId, supplierId, ...rest } = assetMaintenanceDto;
    const asset = await this.assetService.getAssetById(
      assetMaintenanceDto.assetId,
    );
    const supplier = await this.supplierService.getSupplierById(
      assetMaintenanceDto.supplierId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.asset = asset;
    updated.supplier = supplier;
    return await this.assetMaintenanceRepo.save(updated);
  }

  async deleteAssetMaintenance(id: number) {
    return await this.assetMaintenanceRepo.delete({ id });
  }
}
