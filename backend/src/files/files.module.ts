import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FileEntity } from './file.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [FilesService],
  imports: [AuthModule, TypeOrmModule.forFeature([FileEntity])],
  exports: [FilesService],
})
export class FilesModule {}
