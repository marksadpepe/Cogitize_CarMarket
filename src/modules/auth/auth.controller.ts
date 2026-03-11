import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from 'src/modules/auth/auth.service';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { LoginRequestDto } from 'src/modules/auth/dtos/requests/login-request.dto';
import { RefreshTokenRequestDto } from 'src/modules/auth/dtos/requests/refresh-token-request.dto';
import { RegisterRequestDto } from 'src/modules/auth/dtos/requests/register-request.dto';
import { TokensResponseDto } from 'src/modules/auth/dtos/responses/tokens-response.dto';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterRequestDto): Promise<TokensResponseDto> {
    return await this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginRequestDto): Promise<TokensResponseDto> {
    return await this.authService.login(body);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<TokensResponseDto> {
    return await this.authService.refresh(body);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async logout(@CurrentUser() user: JwtPayload): Promise<void> {
    const { sub } = user;

    return await this.authService.logout(sub);
  }
}
