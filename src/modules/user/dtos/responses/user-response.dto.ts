import { IsString, IsUUID } from 'class-validator';

import { User } from 'src/modules/user/interfaces/user.interface';

export class UserResponseDto implements User {
  @IsUUID('4')
  id: string;

  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
