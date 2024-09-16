import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../application/user.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  UserExistEmailReqDto,
  UserGetAccessByRefreshReqDto,
  UserGetRefreshByRefreshReqDto,
  UserLoginByEmailPasswordReqDto,
  UserSignUpReqDto,
} from './user.req.dto';
import { UserAccessByRefreshResDto, UserLoginByEmailPasswordResDto, UserRefreshByRefreshResDto } from './user.res.dto';

@ApiTags('user')
@Controller('')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: '이메일 중복 검사 API',
    description: '이메일를 입력받아 중복인지 확인합니다.',
  })
  @ApiResponse({
    type: Boolean,
    description: 'true => 중복한 이메일이 존재합니다. <br> ' + 'false => 중복한 이메일이 존재하지 않습니다.',
  })
  // ============================================
  @Get('/user/exist-email/:email')
  existEmail(@Param() param: UserExistEmailReqDto) {
    return this.userService.isExistEmail(param.email);
  }

  @ApiOperation({
    summary: '유저 이메일 회원가입 API',
    description:
      'body 정보들을 입력받아 회원가입을 진행합니다. <br>' + '이미 소셜로 가입하였다면 해당 회원가입은 불가능합니다.',
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: '이메일(email) 이 이미 가입되어 있는 경우',
  })
  // ============================================
  @Post('/user/sign-up')
  signUp(@Body() signUpDto: UserSignUpReqDto) {
    return this.userService.signUp(signUpDto);
  }

  @ApiOperation({
    summary: '유저 email password API',
    description:
      '회원가입진행한 id password 를 통해 로그인을 진행합니다.<br>' + '소셜로 로그인 햇을 경우 에러가 발생합니다.',
  })
  @ApiOkResponse({
    type: UserLoginByEmailPasswordResDto,
    description: '로그인에 성공한 경우 토큰 발급',
  })
  @ApiBadRequestResponse({
    description:
      '이메일(email) 이 이미 가입되어 있는 경우<br>' +
      '소셜로 회원가입하여 비밀번호가 존재하지 않는 경우 <br>' +
      '비밀번호가 일치하지 않는 경우',
  })
  // ============================================
  @Post('/user/login-email-password')
  loginByEmailPassword(@Body() loginDto: UserLoginByEmailPasswordReqDto) {
    return this.userService.loginByEmailPassword(loginDto);
  }

  @ApiOperation({
    summary: 'access 토큰 재발급 API',
    description: 'refresh token 을 활용하여 access 토큰 재발급 API',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserAccessByRefreshResDto,
    description: 'access 토큰 재발급 성공',
  })
  @ApiBadRequestResponse({
    description: 'refresh token 을 입력해 주세요.',
  })
  @ApiUnauthorizedResponse({
    description: '토큰이 만료되었습니다.<br>' + '토큰에 에러가 존재합니다.',
  })
  @ApiForbiddenResponse({
    description: '권한이 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '존재하지 않거나 삭제된 유저입니다.',
  })
  // ============================================
  @Post('/user/access-by-refresh')
  getAccessByRefresh(@Body() getBodyDto: UserGetAccessByRefreshReqDto) {
    return this.userService.getAccessByRefresh(getBodyDto.token);
  }

  @ApiOperation({
    summary: 'refresh 토큰 재발급 API',
    description: 'refresh token 을 활용하여 access 및 refresh 토큰 재발급 API',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserRefreshByRefreshResDto,
    description: 'access 및 refresh 토큰 재발급 성공',
  })
  @ApiBadRequestResponse({
    description: 'refresh token 을 입력해 주세요.',
  })
  @ApiUnauthorizedResponse({
    description: '토큰이 만료되었습니다.<br>' + '토큰에 에러가 존재합니다.',
  })
  @ApiForbiddenResponse({
    description: '권한이 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '존재하지 않거나 삭제된 유저입니다.',
  })
  // ============================================
  @Post('/user/refresh-by-refresh')
  getRefreshByToken(@Body() getBody: UserGetRefreshByRefreshReqDto) {
    return this.userService.getLoginTokenByRefresh(getBody.token);
  }
}
