import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ILoginUserInfo } from '../interface/login.user';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as ILoginUserInfo;
});
