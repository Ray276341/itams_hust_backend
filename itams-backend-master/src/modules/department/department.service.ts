import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Department from 'src/models/entities/department.entity';
import { DepartmentRepository } from 'src/models/repositories/department.repository';
import { LocationService } from '../location/location.service';
import { DepartmentDto } from './dtos/department.dto';
import { DepartmentQueryDto } from './dtos/departmentQuery.dto';

@Injectable()
export class DepartmentService {
  private logger = new Logger(DepartmentService.name);

  constructor(
    @InjectRepository(Department) private departmentRepo: DepartmentRepository,
    private locationService: LocationService,
  ) {}

  async getAllDepartments(departmentQuery?: DepartmentQueryDto) {
    const departments = await this.departmentRepo.find({
      relations: { assets: true, users: true, location: true },
      where: {
        location: { id: departmentQuery.locationId },
      },
    });
    const res = departments.map((department) => {
      const { assets, users, location, ...rest } = department;
      return {
        ...rest,
        assets: assets?.length ?? 0,
        users: users?.length ?? 0,
        location: location?.name ?? '',
      };
    });
    return res;
  }

  async getDepartmentByDepartmentId(id: number) {
    const department = await this.departmentRepo.findOne({
      where: { id },
      relations: { location: true },
    });
    const { location, ...rest } = department;
    return {
      ...rest,
      location: location?.name ?? '',
    };
  }

  async getDepartmentById(id: number) {
    const department = await this.departmentRepo.findOneBy({ id });
    return department;
  }

  async getDepartmentByUserId(id: number) {
    const department = await this.departmentRepo.findOne({
      where: { users: { id: id } },
    });
    return department;
  }

  async createNewDepartment(departmentDto: DepartmentDto) {
    if (await this.departmentRepo.findOneBy({ name: departmentDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const department = new Department();
    department.name = departmentDto.name;
    const location = await this.locationService.getLocationById(
      departmentDto.locationId,
    );
    department.location = location;
    await this.departmentRepo.save(department);
    return department;
  }

  async updateDepartment(id: number, departmentDto: DepartmentDto) {
    if (
      (await this.departmentRepo.findOneBy({ id }))?.name !==
        departmentDto.name &&
      (await this.departmentRepo.findOneBy({ name: departmentDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    let toUpdate = await this.departmentRepo.findOneBy({ id });
    let { locationId, ...rest } = departmentDto;
    const location = await this.locationService.getLocationById(
      departmentDto.locationId,
    );
    let updated = Object.assign(toUpdate, rest);
    updated.location = location;
    return await this.departmentRepo.save(updated);
  }

  async deleteDepartment(id: number) {
    try {
      return await this.departmentRepo.delete({ id });
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
