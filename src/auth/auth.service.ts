import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/models/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

export type JwtPayload = {
  email: string;
  sub: string;
};

type AuthResponse = {
  email: string;
  userId: string;
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: CreateUserDto): Promise<AuthResponse> {
    const newUser = await this.usersService.create(signupDto);
    const tokens = await this.getTokens(newUser);
    await this.usersService.updateRefreshToken(
      newUser._id.toHexString(),
      tokens.refresh_token,
    );

    return {
      email: newUser.email,
      userId: newUser._id.toHexString(),
      ...tokens,
    };
  }

  async signin(user: User) {
    const tokens = await this.getTokens(user);
    await this.usersService.updateRefreshToken(
      user._id.toHexString(),
      tokens.refresh_token,
    );

    return {
      email: user.email,
      userId: user._id.toHexString(),
      ...tokens,
    };
  }

  async signout(user: JwtPayload) {
    return this.usersService.updateRefreshToken(user.sub, null);
  }

  async getTokens(user: User) {
    const payload: JwtPayload = {
      sub: user._id.toHexString(),
      email: user.email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { access_token, refresh_token };
  }

  async refreshTokens(userPayload: JwtPayload, refreshToken: string) {
    const user = await this.usersService.findOneById(userPayload.sub);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const doesTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!doesTokenMatch) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user);
    await this.usersService.updateRefreshToken(
      user._id.toHexString(),
      tokens.refresh_token,
    );

    return tokens;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) return user;
    else return null;
  }
}
