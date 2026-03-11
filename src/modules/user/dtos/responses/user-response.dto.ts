import { IsString } from 'class-validator';

import { User } from 'src/modules/user/interfaces/user.interface';

export class UserResponseDto implements User {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
