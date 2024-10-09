import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IFileStorage, IFileUploadFileReturn } from '../interface/file.storage';
import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { join } from 'path';
import process from 'node:process';
import fs from 'node:fs';
import { awsS3AccessKeyId, awsS3Bucket, awsS3Region, awsS3SecretAccessKey } from '../../common/domain/env.const';

@Injectable()
export class FileStorageS3 implements IFileStorage {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow(awsS3Region),
      credentials: {
        accessKeyId: this.configService.getOrThrow(awsS3AccessKeyId),
        secretAccessKey: this.configService.getOrThrow(awsS3SecretAccessKey),
      },
    });
  }

  async uploadImageFile(file: Express.Multer.File): Promise<IFileUploadFileReturn> {
    const bucketName = this.configService.getOrThrow(awsS3Bucket);

    const uploadFileName = `image/${Date.now()}-${file.originalname}`;

    const fileData: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: uploadFileName,
      Body: file.buffer,
      ACL: 'public-read',
    };

    try {
      const command = new PutObjectCommand(fileData);
      await this.s3Client.send(command);

      return {
        url: `https://${bucketName}.s3.amazonaws.com/${uploadFileName}`,
        originalName: file.originalname,
      };
    } catch (e) {
      throw new Error(e as any);
    }
  }

  async downloadFileToLocal(downloadPath: string): Promise<string> {
    const bucketName = this.configService.getOrThrow(awsS3Bucket);

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: downloadPath,
    });

    const { Body } = await this.s3Client.send(command);

    if (Body instanceof Readable) {
      const filePathList = downloadPath.split('/');
      const filePathList2 = downloadPath.split('/')[filePathList.length - 1].split('-');
      const filePath = filePathList2.slice(1).join('');

      const localFilePath = join(process.cwd(), '.', 'public', filePath);
      const writeStream = fs.createWriteStream(localFilePath);
      Body.pipe(writeStream);

      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => resolve(localFilePath));
        writeStream.on('error', reject);
      });
    }
    throw new Error('Body is not a readable stream');
  }
}
