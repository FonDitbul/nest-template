import { ApiProperty } from '@nestjs/swagger';

export class FileUploadImageReqDto {
  @ApiProperty({
    description: '업로드 하고자 하는 이미지 파일',
  })
  // =====================================================
  readonly imageFile: Express.Multer.File;
}

export class FileDownloadReqDto {
  @ApiProperty({
    type: String,
    description: '다운로드 받고자 하는 s3 파일 경로',
  })
  // =====================================================
  readonly filePath: string;
}
