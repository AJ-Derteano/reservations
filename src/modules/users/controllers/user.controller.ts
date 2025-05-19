import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/createUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('create')
  async create(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }
}
