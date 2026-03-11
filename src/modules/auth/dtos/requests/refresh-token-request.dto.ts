import { IsString } from 'class-validator';

import { RefreshTokenData } from 'src/modules/auth/interfaces/payload/refresh-token-data.interface';

export class RefreshTokenRequestDto implements RefreshTokenData {
  @IsString()
  refreshToken: string;
}
