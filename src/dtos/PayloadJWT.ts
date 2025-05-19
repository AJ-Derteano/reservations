import { UserRoles } from 'src/consts/userRoles.const';

export interface PayloadJWT {
  sub: string;
  username: string;
  role: UserRoles;
  requeriedMfa: boolean;
}
