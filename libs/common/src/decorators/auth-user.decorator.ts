import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@prisma/client';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const contextType = ctx.getType();

    let user: User;

    if (contextType === 'http') user = ctx.switchToHttp().getRequest().user;
    else if (contextType === 'ws')
      user = ctx.switchToWs().getClient().request.user;
    else {
      user = ctx.switchToRpc().getContext().user;
    }
    return user;
  },
);
