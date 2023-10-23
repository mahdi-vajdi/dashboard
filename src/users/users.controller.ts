import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Request } from 'express';
import { User } from './models/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Patch('password/update')
  async updatePassword(@Req() req: Request, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(req.user as User, dto);
  }
}
