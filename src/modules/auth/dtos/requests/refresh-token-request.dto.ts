import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { RefreshTokenData } from 'src/modules/auth/interfaces/payload/refresh-token-data.interface';
import { RefreshTokenPayload } from 'src/modules/auth/interfaces/payload/refresh-token-payload.interface';

class RefreshTokenDataDto implements RefreshTokenData {
  @IsString()
  refreshToken: string;
}

export class RefreshTokenRequestDto implements RefreshTokenPayload {
  @ValidateNested()
  @Type(() => RefreshTokenDataDto)
  data: RefreshTokenDataDto;
}
