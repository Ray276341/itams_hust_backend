import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DigitalContent from 'src/models/entities/digitalContent.entity';
import DigitalContentToSourceCode from 'src/models/entities/digitalContentToSourceCode.entity';
import { DigitalContentRepository } from 'src/models/repositories/digitalContent.repository';
import { DigitalContentToSourceCodeRepository } from 'src/models/repositories/digitalContentToSourceCode.repository';
import { SourceCodeModule } from '../sourceCode/sourceCode.module';
import { DigitalContentController } from './digitalContent.controller';
import { DigitalContentService } from './digitalContent.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DigitalContent, DigitalContentToSourceCode]),
    forwardRef(() => SourceCodeModule),
  ],
  controllers: [DigitalContentController],
  providers: [
    DigitalContentService,
    DigitalContentRepository,
    DigitalContentToSourceCodeRepository,
  ],
  exports: [DigitalContentService],
})
export class DigitalContentModule {}
