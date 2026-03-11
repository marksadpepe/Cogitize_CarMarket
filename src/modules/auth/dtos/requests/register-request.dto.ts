import { Type } from 'class-transformer';
import { IsEmail, IsString, MinLength, ValidateNested } from 'class-validator';

import { RegisterData } from 'src/modules/auth/interfaces/payload/register-data.interface';
import { RegisterPayload } from 'src/modules/auth/interfaces/payload/register-payload.interface';

class RegisterDataDto implements RegisterData {
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

export class RegisterRequestDto implements RegisterPayload {
  @ValidateNested()
  @Type(() => RegisterDataDto)
  data: RegisterDataDto;
}
