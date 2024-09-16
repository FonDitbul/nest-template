import { Body, Controller, Logger, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileService } from '../application/file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDownloadReqDto, FileUploadImageReqDto } from './file.req.dto';
import { Express, Response } from 'express';
import { FileUploadResDto } from './file.res.dto';
import fs from 'node:fs';

@ApiTags('file')
@Controller('')
export class FileController {
  private readonly logger = new Logger('FILE');

  constructor(private fileService: FileService) {}

  @ApiOperation({
    summary: '이미지 파일 업로드 API',
    description:
      '이미지 파일 업로드를 위한 API 입니다.<br>' +
      'multipart/form-data 형식, key는 imageFile로 전송하시면 됩니다. <br>' +
      's3에 해당 이미지 파일이 저장됩니다. <br>' +
      'response 값으로 파일의 경로를 드리게 되는데, 해당 경로를 이미지 저장에 있는 API의 값으로 사용하시면 됩니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    type: FileUploadResDto,
    description: '이미지 파일을 성공적으로 업로드한 경우',
  })
  @ApiBadRequestResponse({
    description: '이미지 파일을 업로드 하지 않은 경우',
  })
  // ============================================
  @UseInterceptors(FileInterceptor('imageFile'))
  @Post('file/image')
  createImage(@UploadedFile() imageFile: Express.Multer.File, @Body() dto: FileUploadImageReqDto) {
    return this.fileService.uploadImageFile(imageFile);
  }

  @ApiOperation({
    summary: 's3 파일 업로드 다운로드 API',
    description: '모든 파일에 대한 다운로드<br>' + 's3에 대한 src를 입력받아 해당 파일을 다운로드 합니다.',
  })
  @ApiOkResponse({
    description: '파일을 성공적으로 다운로드 한 경우',
  })
  // ============================================
  @Post('download')
  async download(@Body() dto: FileDownloadReqDto, @Res() res: Response) {
    const filePath = await this.fileService.download(dto);

    const downloadFileSplit = filePath.split('/');
    const fileName = downloadFileSplit[downloadFileSplit.length - 1];

    const encodedFileName = encodeURIComponent(fileName);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Content-Disposition', `attachment; filename=${encodedFileName}`);
    // 파일 스트리밍 전송
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('close', async () => {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          this.logger.error(`파일 삭제 실패 ${unlinkErr}`);
        }
      });
    });
  }
}
