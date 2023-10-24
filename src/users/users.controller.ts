import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalAuthGuard } from 'src/common/guards/local.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Request } from 'express';
import { User } from './models/user.schema';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { JwtPayload } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Patch()
  async update(@Req() req: Request, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user as JwtPayload, dto);
  }

  @UseGuards(LocalAuthGuard)
  @Patch('password/update')
  async updatePassword(@Req() req: Request, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(req.user as User, dto);
  }
}
