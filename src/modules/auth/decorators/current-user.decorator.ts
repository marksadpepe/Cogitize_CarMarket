import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return <JwtPayload>request['user'];
  },
);
