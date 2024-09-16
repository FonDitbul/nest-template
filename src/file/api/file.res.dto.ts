import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResDto {
  @ApiProperty({
    description: '입력받은 파일 이름',
  })
  // =====================================================
  readonly originalName: string;

  @ApiProperty({
    description: '업로드된 파일 경로',
  })
  // =====================================================
  readonly url: string;
}
