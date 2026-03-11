import { UserRole } from 'src/modules/user/interfaces/user-role.enum';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}
