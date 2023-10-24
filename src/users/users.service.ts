import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { OperatorsService } from 'src/operators/operators.service';
import { User } from './models/user.schema';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtPayload } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly operatorsService: OperatorsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email doesn't already exist.
    const exists = await this.usersRepository.userExists(
      createUserDto.email,
      createUserDto.phone,
    );
    if (exists) throw new ConflictException('User already exists');

    const user = await this.usersRepository.create({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    // create default operator with user info
    await this.operatorsService.createDefaultOperator(user);

    return user;
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOne({ email });
  }

  async findOneById(userId: string) {
    return this.usersRepository.findOne({ _id: userId });
  }

  async update(user: JwtPayload, dto: UpdateUserDto) {
    return this.usersRepository.update(user.sub, dto);
  }

  async updatePassword(user: User, dto: UpdatePasswordDto) {
    // Check to see if new password is not equal to old one
    const isPasswordSame = await bcrypt.compare(dto.newPassword, user.password);
    if (isPasswordSame)
      throw new BadRequestException(
        'You new password cannot be same as the old one',
      );

    // Validation passed and password can be changed
    return this.usersRepository.update(user._id, {
      password: await bcrypt.hash(dto.newPassword, 10),
    });
  }

  async updateRefreshToken(userId: string, token: string) {
    return this.usersRepository.update(userId, {
      refreshToken: await bcrypt.hash(token, 10),
    });
  }
}
