import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserExistEmailReqDto {
  @ApiProperty({
    description: '중복 검사 하고자 하는 이메일',
  })
  // =======================
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class UserSignUpReqDto {
  @ApiProperty({
    type: String,
    description: '가입하고자 하는 email',
  })
  // =================================
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: String,
    description: '비밀번호 최소 6글자',
  })
  // =================================
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    type: String,
    description: '이름',
  })
  // =================================
  @IsNotEmpty()
  readonly name: string;
}

export class UserGetAccessByRefreshReqDto {
  @ApiProperty({
    type: String,
    description: '발급받았던 refreshToken',
  })
  // ================================
  @IsNotEmpty()
  token: string;
}

export class UserGetRefreshByRefreshReqDto {
  @ApiProperty({
    type: String,
    description: '발급받았던 refreshToken',
  })
  // ================================
  @IsNotEmpty()
  token: string;
}

export class UserLoginByEmailPasswordReqDto {
  @ApiProperty({
    type: String,
    description: '가입하고자 하는 email',
  })
  // =================================
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: String,
    description: '비밀번호',
  })
  // =================================
  @IsNotEmpty()
  readonly password: string;
}
