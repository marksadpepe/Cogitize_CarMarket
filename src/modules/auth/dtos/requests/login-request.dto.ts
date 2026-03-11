import { IsEmail, IsString } from 'class-validator';

import { LoginData } from 'src/modules/auth/interfaces/payload/login-data.interface';

export class LoginRequestDto implements LoginData {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
