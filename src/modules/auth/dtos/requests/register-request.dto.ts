import { IsEmail, IsString, MinLength } from 'class-validator';

import { RegisterData } from 'src/modules/auth/interfaces/payload/register-data.interface';

export class RegisterRequestDto implements RegisterData {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
