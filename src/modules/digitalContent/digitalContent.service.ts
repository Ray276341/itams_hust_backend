import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DigitalContent } from 'src/models/entities/digitalContent.entity';
import DigitalContentToSourceCode from 'src/models/entities/digitalContentToSourceCode.entity';
import { DigitalContentRepository } from 'src/models/repositories/digitalContent.repository';
import { DigitalContentToSourceCodeRepository } from 'src/models/repositories/digitalContentToSourceCode.repository';
import { SourceCodeService } from '../sourceCode/sourceCode.service';
import { CheckinDigitalContentDto } from './dtos/checkinDigitalContent.dto';
import { CheckoutDigitalContentDto } from './dtos/checkoutDigitalContent.dto';
import { DigitalContentDto } from './dtos/digitalContent.dto';
import { DigitalContentToSourceCodeQueryDto } from './dtos/digitalContentToSourceCode.dto';

@Injectable()
export class DigitalContentService {
  private logger = new Logger(DigitalContentService.name);

  constructor(
    @InjectRepository(DigitalContent)
    private digitalContentRepo: DigitalContentRepository,
    @InjectRepository(DigitalContentToSourceCode)
    private digitalContentToSourceCodeRepo: DigitalContentToSourceCodeRepository,
    private sourceCodeService: SourceCodeService,
  ) {}

  async getAllDigitalContents() {
    const digitalContents = await this.digitalContentRepo.find();
    return digitalContents;
  }

  async getDigitalContentById(id: number) {
    const digitalContent = await this.digitalContentRepo.findOneBy({ id });
    return digitalContent;
  }

  async getDigitalContentToSourceCode(
    digitalContentToSourceCodeDto?: DigitalContentToSourceCodeQueryDto,
  ) {
    const sourceCodeToUsers = await this.digitalContentToSourceCodeRepo.find({
      relations: {
        sourceCode: true,
        digitalContent: true,
      },
      where: {
        sourceCode: { id: digitalContentToSourceCodeDto.sourceCodeId },
        digitalContent: { id: digitalContentToSourceCodeDto.digitalContentId },
      },
      withDeleted: digitalContentToSourceCodeDto.withDeleted,
    });
    const res = sourceCodeToUsers.map((sourceCodeToUser) => {
      const { sourceCode, digitalContent, ...rest } = sourceCodeToUser;
      return {
        ...rest,
        sourceCodeId: sourceCode?.id,
        sourceCodeName: sourceCode?.name,
        digitalContentId: digitalContent?.id,
        digitalContentName: digitalContent?.name,
      };
    });
    return res;
  }

  async createNewDigitalContent(digitalContentDto: DigitalContentDto) {
    const digitalContent = Object.assign({}, digitalContentDto);
    await this.digitalContentRepo.save(digitalContent);
    return digitalContent;
  }

  async updateDigitalContent(id: number, digitalContentDto: DigitalContentDto) {
    let toUpdate = await this.digitalContentRepo.findOneBy({ id });

    let updated = Object.assign(toUpdate, digitalContentDto);
    return await this.digitalContentRepo.save(updated);
  }

  async deleteDigitalContent(id: number) {
    const toRemove = await this.digitalContentRepo.findOneOrFail({
      where: { id },
      relations: { digitalContentToSourceCodes: true },
    });
    return await this.digitalContentRepo.softRemove(toRemove);
  }

  /*------------------------ checkin/checkout sourceCode ------------------------- */

  async checkoutDigitalContent(
    checkoutDigitalContentDto: CheckoutDigitalContentDto,
  ) {
    if (
      await this.digitalContentToSourceCodeRepo.findOne({
        where: {
          digitalContent: { id: checkoutDigitalContentDto.digitalContentId },
          sourceCode: { id: checkoutDigitalContentDto.sourceCodeId },
        },
      })
    )
      throw new HttpException(
        'This source code is already checkout',
        HttpStatus.BAD_REQUEST,
      );
    const digitalContent = await this.digitalContentRepo.findOne({
      where: { id: checkoutDigitalContentDto.digitalContentId },
    });
    const sourceCode = await this.sourceCodeService.getSourceCodeById(
      checkoutDigitalContentDto.sourceCodeId,
    );
    const digitalContentToSourceCode = new DigitalContentToSourceCode();
    digitalContentToSourceCode.digitalContent = digitalContent;
    digitalContentToSourceCode.sourceCode = sourceCode;
    digitalContentToSourceCode.checkout_date =
      checkoutDigitalContentDto.checkout_date;
    digitalContentToSourceCode.checkout_note =
      checkoutDigitalContentDto.checkout_note;
    await this.digitalContentToSourceCodeRepo.save(digitalContentToSourceCode);
    return digitalContentToSourceCode;
  }

  async checkinDigitalContent(
    checkinDigitalContentDto: CheckinDigitalContentDto,
  ) {
    const digitalContentToSourceCode =
      await this.digitalContentToSourceCodeRepo.findOneBy({
        id: checkinDigitalContentDto.digitalContentToSourceCodeId,
      });
    digitalContentToSourceCode.checkin_date =
      checkinDigitalContentDto.checkin_date;
    digitalContentToSourceCode.checkin_note =
      checkinDigitalContentDto.checkin_note;
    await this.digitalContentToSourceCodeRepo.save(digitalContentToSourceCode);
    await this.digitalContentToSourceCodeRepo.softDelete({
      id: checkinDigitalContentDto.digitalContentToSourceCodeId,
    });
    return digitalContentToSourceCode;
  }
}
