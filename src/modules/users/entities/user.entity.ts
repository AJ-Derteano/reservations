import { BeforeInsert, Column, Entity, Index } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../interfaces/user.interface';
import { BaseEntity } from 'src/config/baseEntity';
import { EntityNames } from 'src/consts/entityNames.const';
import { UserRoles } from 'src/consts/userRoles.const';
import { Exclude } from 'class-transformer';

@Entity(EntityNames.User)
@Index(['username'], { unique: true })
export class UserEntity extends BaseEntity implements User {
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: UserRoles })
  role: UserRoles;

  @Column({ nullable: true })
  totpSecret: string;

  @BeforeInsert()
  async hashPassword() {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    this.password = bcrypt.hashSync(this.password, salt);

    this.username = this.username
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLocaleLowerCase();
  }
}
