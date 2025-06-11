import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from 'src/models/entities/manufacturer.entity';
import { ManufacturerRepository } from 'src/models/repositories/manufacturer.repository';
import { FirebaseService } from '../firebase/firebase.service';
import { ManufacturerDto } from './dtos/manufacturer.dto';
import { IMAGE_PATH } from './manufacturer.constants';

@Injectable()
export class ManufacturerService {
  private logger = new Logger(ManufacturerService.name);

  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepo: ManufacturerRepository,
    private firebaseService: FirebaseService,
  ) {}

  async getAllManufacturers() {
    const manufacturers = await this.manufacturerRepo.find({
      relations: { assetModels: true, licenses: true },
    });
    const res = manufacturers.map((manufacturer) => {
      const { assetModels, licenses, ...rest } = manufacturer;
      return {
        ...rest,
        assetModels: assetModels.length,
        licenses: licenses.length,
      };
    });
    return res;
  }

  async getManufacturerById(id: number) {
    const manufacturer = await this.manufacturerRepo.findOneBy({ id });
    return manufacturer;
  }

  async createNewManufacturer(manufacturerDto: ManufacturerDto) {
    if (await this.manufacturerRepo.findOneBy({ name: manufacturerDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const manufacturer = new Manufacturer();
    manufacturer.name = manufacturerDto.name;
    await this.manufacturerRepo.save(manufacturer);
    return manufacturer;
  }

  async saveImage(id: number, file: Express.Multer.File) {
    // upload ảnh lên storage
    const image = await this.firebaseService.uploadFile(file, IMAGE_PATH);
    // cập nhật db
    return await this.manufacturerRepo.update({ id }, { image });
  }

  async updateManufacturer(id: number, manufacturerDto: ManufacturerDto) {
    if (
      (await this.manufacturerRepo.findOneBy({ id }))?.name !==
        manufacturerDto.name &&
      (await this.manufacturerRepo.findOneBy({ name: manufacturerDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    let toUpdate = await this.manufacturerRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, manufacturerDto);
    return await this.manufacturerRepo.save(updated);
  }

  async deleteManufacturer(id: number) {
    try {
      return await this.manufacturerRepo.delete({ id });
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
