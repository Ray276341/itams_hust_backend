import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SourceCode from 'src/models/entities/sourceCode.entity';
import SourceCodeToUser from 'src/models/entities/sourceCodeToUser.entity';
import { SourceCodeRepository } from 'src/models/repositories/sourceCode.repository';
import { SourceCodeToUserRepository } from 'src/models/repositories/sourceCodeToUser.repository';
import { UsersModule } from '../users/users.module';
import { SourceCodeController } from './sourceCode.controller';
import { SourceCodeService } from './sourceCode.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SourceCode, SourceCodeToUser]),
    forwardRef(() => UsersModule),
  ],
  controllers: [SourceCodeController],
  providers: [
    SourceCodeService,
    SourceCodeRepository,
    SourceCodeToUserRepository,
  ],
  exports: [SourceCodeService],
})
export class SourceCodeModule {}
