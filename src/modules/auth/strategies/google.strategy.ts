import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigType } from '@nestjs/config';
import envConfig from 'src/config/env.config';

import { AuthService } from '../services/auth.service';
import { UserService } from 'src/modules/users/services/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(envConfig.KEY) configService: ConfigType<typeof envConfig>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.GOOGLE_CLIENT_ID,
      clientSecret: configService.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://ajderteano.nom.pe/v1/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const googleUser = {
      username: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      emails: emails[0].value,
    };

    // Guarda o busca usuario en Mongo
    const user = await this.userService.findOrCreateGoogle(googleUser);

    // Crea JWT
    const token = await this.authService.generateJWT(user.username);

    // Devuelve payload enriquecido
    done(null, {
      user,
      access_token: token,
    });
  }
}
