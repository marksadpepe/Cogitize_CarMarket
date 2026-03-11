import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { RefreshTokenEntity } from 'src/modules/auth/entities/refresh-token.entity';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { OptionalJwtGuard } from 'src/modules/auth/guards/optional-jwt.guard';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity, UserEntity]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, OptionalJwtGuard],
  exports: [JwtGuard, OptionalJwtGuard, JwtModule],
})
export class AuthModule {}
