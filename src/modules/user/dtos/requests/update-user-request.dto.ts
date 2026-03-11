import { IsEmail, IsOptional, IsString } from 'class-validator';

import { UpdateUserData } from 'src/modules/user/interfaces/payload/update-user-data.interface';

export class UpdateUserRequestDto implements UpdateUserData {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
