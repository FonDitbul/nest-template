import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    type: String,
    description: '토큰 value',
  })
  // =====================================================
  readonly value: string;

  @ApiProperty({
    type: String,
    description: '토큰 만료 날짜',
  })
  // =====================================================
  readonly expiredAt: string;
}

export class LoginTokenResDto {
  @ApiProperty({
    type: TokenDto,
    description: 'access 토큰 정보',
  })
  // =====================================================
  readonly accessToken: TokenDto;

  @ApiProperty({
    type: TokenDto,
    description: 'refresh 토큰 정보',
  })
  // =====================================================
  readonly refreshToken: TokenDto;
}
