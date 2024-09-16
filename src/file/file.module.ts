import { Module } from '@nestjs/common';
import { FileService } from './application/file.service';
import { FileController } from './api/file.controller';
import { FileStorageS3 } from './infrastructure/file.storage.s3';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: 'IFileStorage',
      useClass: FileStorageS3,
    },
  ],
})
export class FileModule {}
