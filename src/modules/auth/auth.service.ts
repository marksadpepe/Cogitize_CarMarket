import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Config } from 'src/config/interfaces/config.interface';
import { RefreshTokenEntity } from 'src/modules/auth/entities/refresh-token.entity';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { LoginData } from 'src/modules/auth/interfaces/payload/login-data.interface';
import { RefreshTokenData } from 'src/modules/auth/interfaces/payload/refresh-token-data.interface';
import { RegisterData } from 'src/modules/auth/interfaces/payload/register-data.interface';
import { Tokens } from 'src/modules/auth/interfaces/tokens.interface';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRole } from 'src/modules/user/interfaces/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Config, true>,
  ) {}

  async register(data: RegisterData): Promise<Tokens> {
    const { email, password, firstName, lastName } = data;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.save(
      this.userRepository.create({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: UserRole.User,
      }),
    );

    return await this.generateTokens(user);
  }

  async login(data: LoginData): Promise<Tokens> {
    const { email, password } = data;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: hashedPassword } = user;

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.generateTokens(user);
  }

  async refresh(data: RefreshTokenData): Promise<Tokens> {
    const { refreshToken } = data;

    const refreshSecret = this.configService.get('jwt.refreshSecret', {
      infer: true,
    });

    const { sub } = await this.jwtService.verifyAsync<JwtPayload>(
      refreshToken,
      {
        secret: refreshSecret,
      },
    );

    const tokenRecord = await this.refreshTokenRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: sub,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException();
    }

    const { token } = tokenRecord;

    const isTokenValid = await bcrypt.compare(refreshToken, token);

    if (!isTokenValid) {
      throw new UnauthorizedException();
    }

    const { expiresAt } = tokenRecord;

    if (expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const { id: tokenId } = tokenRecord;

    await this.refreshTokenRepository.update(tokenId, {
      refreshedAt: new Date(),
    });
    await this.refreshTokenRepository.softDelete(tokenId);

    const { user } = tokenRecord;

    return await this.generateTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.refreshTokenRepository.softDelete({
      user: {
        id: userId,
      },
    });
  }

  private async generateTokens(user: UserEntity): Promise<Tokens> {
    const { id: userId, role } = user;

    const jwtPayload: JwtPayload = { sub: userId, role };

    const accessSecret = this.configService.get('jwt.accessSecret', {
      infer: true,
    });
    const accessExpiresIn = this.configService.get('jwt.accessExpiresIn', {
      infer: true,
    });
    const refreshSecret = this.configService.get('jwt.refreshSecret', {
      infer: true,
    });
    const refreshExpiresIn = this.configService.get('jwt.refreshExpiresIn', {
      infer: true,
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: accessSecret,
        expiresIn: <JwtSignOptions['expiresIn']>accessExpiresIn,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: refreshSecret,
        expiresIn: <JwtSignOptions['expiresIn']>refreshExpiresIn,
      }),
    ]);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.save(
      this.refreshTokenRepository.create({
        token: hashedRefreshToken,
        user,
        expiresAt,
      }),
    );

    return { accessToken, refreshToken };
  }
}
