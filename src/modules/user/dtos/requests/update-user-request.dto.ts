import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

import { UpdateUserData } from 'src/modules/user/interfaces/payload/update-user-data.interface';
import { UpdateUserPayload } from 'src/modules/user/interfaces/payload/update-user-payload.interface';

class UpdateUserDataDto implements UpdateUserData {
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

export class UpdateUserRequestDto implements UpdateUserPayload {
  @ValidateNested()
  @Type(() => UpdateUserDataDto)
  data: UpdateUserDataDto;
}
