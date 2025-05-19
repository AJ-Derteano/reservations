import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoles } from 'src/consts/userRoles.const';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRoles)
  @IsOptional()
  role: UserRoles;
}
