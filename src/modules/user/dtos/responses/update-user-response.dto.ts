import { IsBoolean } from 'class-validator';

import { UpdateUser } from 'src/modules/user/interfaces/update-user.interface';

export class UpdateUserResponseDto implements UpdateUser {
  @IsBoolean()
  success: boolean;
}
