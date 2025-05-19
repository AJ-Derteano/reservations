import { UserRoles } from 'src/consts/userRoles.const';

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRoles;
  createdAt: Date;
  updatedAt: Date;
}
