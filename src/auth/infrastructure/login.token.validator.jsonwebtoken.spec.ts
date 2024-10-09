import { ILoginUserInfo } from '../interface/login.user';
import { LoginTokenValidatorJsonwebtoken } from './login.token.validator.jsonwebtoken';
import { mock, MockProxy } from 'jest-mock-extended';
import { MockConfigService } from '../../common/test/config.service';
import {
  accessTokenExpireSecond as envAccessTokenExpireSecond,
  refreshTokenExpireSecond as envRefreshTokenExpireSecond,
  tokenSecretKey,
} from '../../common/domain/env.const';

describe('login token validator With jsonwebtoken 테스트', () => {
  const configService: MockProxy<MockConfigService> = mock<MockConfigService>();

  const sut = new LoginTokenValidatorJsonwebtoken(configService);

  it('issuance 토큰 발급 테스트', () => {
    const givenLoginUser: ILoginUserInfo = {
      id: 1,
      email: 'test@test.com',
      name: 'name',
      role: 'user',
    };
    configService.getOrThrow.calledWith(tokenSecretKey).mockReturnValue('SECRET');
    configService.getOrThrow.calledWith(envAccessTokenExpireSecond).mockReturnValue('3600');
    configService.getOrThrow.calledWith(envRefreshTokenExpireSecond).mockReturnValue('36000');

    const result = sut.issuance(givenLoginUser);

    const now = new Date();
    expect(result.accessToken).toBeDefined();
    expect(new Date(result.accessToken.expiredAt).getTime()).toBeGreaterThan(now.getTime());
    expect(result.refreshToken).toBeDefined();
    expect(new Date(result.refreshToken.expiredAt).getTime()).toBeGreaterThan(now.getTime());
  });
});
