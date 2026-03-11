import { IsBoolean } from 'class-validator';

import { DeleteUser } from 'src/modules/user/interfaces/delete-user.interface';

export class DeleteUserResponseDto implements DeleteUser {
  @IsBoolean()
  success: boolean;
}
