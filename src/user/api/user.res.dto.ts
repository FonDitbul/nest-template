import { LoginTokenResDto, TokenDto } from '../../auth/api/token.res.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GolfReviewViewDto } from '../../golf/golf/api/dto/golf.review.view.dto';
import { UserGolfLikeDto } from './dto/user.golf.like.dto';

export class UserLoginByEmailPasswordResDto extends LoginTokenResDto {
  @ApiProperty({
    type: String,
    description: '로그인한 유저의 이름 ',
  })
  // =====================================================
  readonly name: string;
}

export class UserAccessByRefreshResDto {
  @ApiProperty({
    type: TokenDto,
    description: 'access 토큰 정보',
  })
  // =====================================================
  readonly accessToken: TokenDto;
}

export class UserRefreshByRefreshResDto extends LoginTokenResDto {}

export class UserGetCountResDto {
  @ApiProperty({
    type: Number,
    description: '유저 골프 좋아요 개수',
  })
  userGolfLikeCount: number;

  @ApiProperty({
    type: Number,
    description: '유저 리뷰 개수',
  })
  reviewCount: number;

  @ApiProperty({
    type: Number,
    description: '유저 보유 쿠폰 개수',
  })
  couponCount: number;
}

export class UserReviewListResDto {
  @ApiProperty({
    type: [GolfReviewViewDto],
    description: '유저가 쓴 리뷰 리스트 ',
  })
  list: GolfReviewViewDto[];

  @ApiProperty({
    type: Number,
    description: '총 리뷰 개수',
  })
  totalCount: number;

  @ApiProperty({
    type: Boolean,
    description: '마지막 페이지인지',
  })
  isLast: boolean;
}

export class UserGolfLikeListResDto {
  @ApiProperty({
    type: [UserGolfLikeDto],
    description: '유저가 좋아요 누른 ',
  })
  list: UserGolfLikeDto[];

  @ApiProperty({
    type: Boolean,
    description: '마지막 페이지인지',
  })
  isLast: boolean;
}
