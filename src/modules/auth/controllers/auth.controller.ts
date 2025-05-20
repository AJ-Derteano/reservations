import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestExpress } from '../interfaces/requesExpress';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  async signIn(@Req() req: RequestExpress) {
    const username = req.user.username;

    const token = await this.authServices.generateJWT(username);

    return {
      token,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('mfa/setup')
  async setupMfa(@Req() req: RequestExpress) {
    const { username } = req.user;

    return this.authServices.generateTotpSecret(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('mfa/verify')
  async verifyMfa(@Req() req: RequestExpress, @Body() body: { token: string }) {
    const { username } = req.user;
    return this.authServices.verifyTotpCode(username, body.token);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Este endpoint redirige a Google automáticamente
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { access_token } = req.user as any;

    return res.redirect(
      `https://ajderteano.nom.pe/callback?token=${access_token}`,
    );
  }
}
