import { IsString } from 'class-validator';

import { Tokens } from 'src/modules/auth/interfaces/tokens.interface';

export class TokensResponseDto implements Tokens {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
