import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ErrorManager } from 'src/utils/errorManager.util';
import { PayloadJWT } from 'src/dtos/PayloadJWT';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { UserService } from 'src/modules/users/services/user.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServices: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = (await this.userServices.findByKey({
        key: 'username',
        value: username,
        one: true,
      })) as UserEntity;

      if (!user) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'user/not-found',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'user/invalid-password',
        });
      }

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async generateJWT(username: string) {
    const user = (await this.userServices.findByKey({
      key: 'username',
      value: username,
      one: true,
    })) as UserEntity;

    const payload: PayloadJWT = {
      username: user.username,
      sub: user.username,
      role: user.role,
      requeriedMfa: !!user.totpSecret,
    };

    return this.jwtService.sign(payload);
  }

  async generateTotpSecret(username: string) {
    const user = (await this.userServices.findByKey({
      key: 'username',
      value: username,
      one: true,
    })) as UserEntity;

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const secret = speakeasy.generateSecret({
      name: `RESERVATIONS (${username})`,
    });

    // Guardamos el secreto en el usuario
    user.totpSecret = secret.base32;

    await this.userServices.update(user.id, user);

    const otpauthUrl = secret.otpauth_url;
    const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);

    return {
      message: 'Escanea el QR en Google Authenticator',
      qrCodeDataURL,
    };
  }

  async verifyTotpCode(username: string, token: string) {
    const user = (await this.userServices.findByKey({
      key: 'username',
      value: username,
      one: true,
    })) as UserEntity;

    if (!user?.totpSecret)
      throw new UnauthorizedException('Usuario no encontrado o sin MFA');

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token,
    });

    if (!verified) throw new UnauthorizedException('Código MFA inválido');

    return { status: 'success' };
  }
}
