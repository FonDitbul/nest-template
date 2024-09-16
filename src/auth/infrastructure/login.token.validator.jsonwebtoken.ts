import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload, sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { addSeconds, format } from 'date-fns';
import { ILoginToken } from '../interface/token';
import { ILoginTokenValidator } from '../interface/login.token.validator';
import { ConfigService } from '@nestjs/config';
import { ILoginUserInfo } from '../interface/login.user';
import { DateFormatStr } from '../../common/domain/date.format.str';

@Injectable()
export class LoginTokenValidatorJsonwebtoken implements ILoginTokenValidator {
  constructor(private configService: ConfigService) {}

  private transformUserInfo(payload: JwtPayload): ILoginUserInfo {
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
    };
  }

  // 토큰 발급
  issuance(loginUser: ILoginUserInfo): ILoginToken {
    const now = new Date();
    const secretJwtKey: string = this.configService.getOrThrow('TOKEN_SECRET_KEY');

    const accessTokenExpireSecond = +this.configService.getOrThrow('ACCESS_TOKEN_EXPIRE_SECOND');
    const refreshTokenExpireSecond = +this.configService.getOrThrow('REFRESH_TOKEN_EXPIRE_SECOND');

    const accessTokenExpire = addSeconds(now, accessTokenExpireSecond);
    const refreshTokenExpire = addSeconds(now, refreshTokenExpireSecond);

    const accessToken = sign(loginUser, secretJwtKey, {
      expiresIn: accessTokenExpireSecond,
    });
    const refreshToken = sign(loginUser, secretJwtKey, {
      expiresIn: refreshTokenExpireSecond,
    });

    return {
      accessToken: {
        value: accessToken,
        expiredAt: format(accessTokenExpire, DateFormatStr),
      },
      refreshToken: {
        value: refreshToken,
        expiredAt: format(refreshTokenExpire, DateFormatStr),
      },
    };
  }

  // access token 으로 유효성 검증
  validateByToken(token: string) {
    const secretJwtKey: string = this.configService.getOrThrow('TOKEN_SECRET_KEY');

    try {
      const tokenDecoded = verify(token, secretJwtKey, { complete: true });

      return this.transformUserInfo(tokenDecoded.payload as JwtPayload);
    } catch (e) {
      if (e) {
        if (e instanceof TokenExpiredError) {
          throw new UnauthorizedException('토큰만료');
        }
        throw new UnauthorizedException('토큰 에러');
      }
      throw new Error(e);
    }
  }
}
