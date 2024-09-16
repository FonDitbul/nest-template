import { BadRequestException, CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { LoginTokenValidatorJsonwebtoken } from '../infrastructure/login.token.validator.jsonwebtoken';

@Injectable()
export class AuthUserAuthorizationGuard implements CanActivate {
  constructor(
    @Inject('ILoginTokenValidator')
    private loginTokenValidator: LoginTokenValidatorJsonwebtoken,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const bearerToken = request.get('Authorization');
    if (!bearerToken) {
      throw new BadRequestException('토큰이 존재하지 않습니다.');
    }
    const token = bearerToken.split(' ')[1];

    request.user = this.loginTokenValidator.validateByToken(token);

    return true;
  }
}
