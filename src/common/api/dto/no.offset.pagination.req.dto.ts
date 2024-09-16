import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class NoOffsetPagingReqDto {
  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    description: '마지막 id',
  })
  // ====================
  @IsOptional()
  @Type(() => Number)
  lastId?: number;

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
