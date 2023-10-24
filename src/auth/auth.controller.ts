import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService, JwtPayload } from './auth.service';
import { Request } from 'express';
import { LocalAuthGuard } from '../common/guards/local.guard';
import { User } from 'src/users/models/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: CreateUserDto) {
    return this.authService.signup(signupDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req: Request) {
    return this.authService.signin(req.user as User);
  }

  @UseGuards(AccessTokenGuard)
  @Get('signout')
  async signout(@Req() req: Request) {
    return this.authService.signout(req.user as JwtPayload);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return this.authService.refreshTokens(req.user as JwtPayload, refreshToken);
  }
}
