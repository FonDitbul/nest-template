import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthUserAuthorizationGuard } from './auth.user.authorization.guard';

@Injectable()
export class UserAuthGuard extends AuthUserAuthorizationGuard {
  canActivate(context: ExecutionContext): boolean {
    super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    return request.user.role === 'user';
  }
}
