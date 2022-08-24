import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): string | undefined => {
    return context.switchToHttp().getRequest().user;
  },
);
