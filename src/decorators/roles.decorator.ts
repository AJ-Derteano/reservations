import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../consts/userRoles.const';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
