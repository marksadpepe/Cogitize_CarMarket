import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { Config } from 'src/config/interfaces/config.interface';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Config, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      return true;
    }

    const accessSecret = this.configService.get('jwt.accessSecret', {
      infer: true,
    });

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: accessSecret,
      });

      request['user'] = payload;
    } catch {
      // invalid token — proceed without user
    }

    return true;
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : null;
  }
}
