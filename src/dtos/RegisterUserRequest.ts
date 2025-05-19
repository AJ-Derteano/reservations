import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/modules/users/interfaces/user.interface';

export class RegisterUserRequest
  implements Pick<User, 'username' | 'password'>
{
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
