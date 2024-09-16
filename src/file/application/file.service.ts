import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IFileStorage } from '../interface/file.storage';
import { FileDownloadReqDto } from '../api/file.req.dto';

@Injectable()
export class FileService {
  constructor(
    @Inject('IFileStorage')
    private fileStorage: IFileStorage,
  ) {}

  async uploadImageFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('not exist image file');
    }

    // 한글 깨짐 방지
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

    const mime = file.mimetype;

    if (!mime.startsWith('image/')) {
      throw new BadRequestException('NO_IMAGE_FILE_TYPE');
    }

    const fileReturn = await this.fileStorage.uploadImageFile(file);

    return fileReturn;
  }

  async download(dto: FileDownloadReqDto) {
    try {
      const key = dto.filePath.split('.com/').slice(1).join('');
      return this.fileStorage.downloadFileToLocal(key);
    } catch (error) {
      throw new Error('올바른 파일 경로가 아닙니다.');
    }
  }
}
