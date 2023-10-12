import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseSignin } from './interfaces/response-signin.interface';
import { User } from 'src/users/models/user.schema';

export type AuthPayload = {
  email: string;
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<ResponseSignin> {
    const createdUser = await this.usersService.create(signupDto);
    const signinObject = this.signin(createdUser);
    return {
      message: 'Signup Successfull',
      email: createdUser.email,
      userId: createdUser._id.toHexString(),
      access_token: signinObject.access_token,
    };
  }

  signin(user: User): ResponseSignin {
    const payload: AuthPayload = {
      email: user.email,
      sub: user._id.toHexString(),
    };

    return {
      message: 'Signin Successfull',
      email: user.email,
      userId: user._id.toHexString(),
      access_token: this.jwtService.sign(payload),
    };
  }

  async validate(email: string, password: string) {
    return this.usersService.verifyUser(email, password);
  }
}
