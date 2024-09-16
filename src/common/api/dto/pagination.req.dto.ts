import { IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PagingReqDto {
  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    description: '현재 페이지',
  })
  // ====================
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({
    type: Number,
    default: 10,
    description: '가져오고자 하는 데이터 개수',
  })
  // ====================
  @IsOptional()
  @Type(() => Number)
  take: number = 10;
}
