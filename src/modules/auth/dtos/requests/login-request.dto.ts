import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested } from 'class-validator';

import { LoginData } from 'src/modules/auth/interfaces/payload/login-data.interface';
import { LoginPayload } from 'src/modules/auth/interfaces/payload/login-payload.interface';

class LoginDataDto implements LoginData {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginRequestDto implements LoginPayload {
  @ValidateNested()
  @Type(() => LoginDataDto)
  data: LoginDataDto;
}
