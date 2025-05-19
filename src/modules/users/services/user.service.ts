import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/createUser.dto';
import { User } from '../interfaces/user.interface';
import { ErrorManager } from 'src/utils/errorManager.util';
import { UserRoles } from 'src/consts/userRoles.const';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: CreateUserDto): Promise<UserEntity> {
    try {
      if (user.username) {
        const userExists = await this.userRepository.findOne({
          where: { username: user.username },
        });

        if (userExists) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message: 'user/already-exists',
          });
        }
      }

      const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
      user.password = bcrypt.hashSync(user.password, salt);
      return await this.userRepository.save({
        username: user.username,
        password: user.password,
        email: user.email,
        role: UserRoles.CLIENT,
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findByKey({
    key,
    value,
    one = false,
  }: {
    key: keyof User;
    value: any;
    one?: boolean;
  }): Promise<UserEntity | UserEntity[]> {
    try {
      const user = this.userRepository.createQueryBuilder('user').where({
        [key]: value,
      });

      if (one) {
        return await user.getOneOrFail();
      }

      return await user.getMany();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findOrCreateGoogle(user: Partial<User>): Promise<UserEntity> {
    try {
      const userExists = await this.userRepository.findOne({
        where: { username: user.username },
      });

      if (userExists) {
        return userExists;
      }

      const newUser = await this.userRepository.save({
        username: user.username,
        password: 'google',
        role: UserRoles.CLIENT,
        ...user,
      });

      return newUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async update(id: number, user: Partial<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.save({
      id,
      ...user,
    } as UserEntity);
  }
}
