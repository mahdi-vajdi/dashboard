import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { User } from './models/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email doesn't already exist.
    await this.validateCreateUserDto(createUserDto);

    return this.usersRepository.create({
      ...createUserDto,
      createdAt: new Date(),
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneByEmail(email);
  }

  async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOneByEmail(email);
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid)
      throw new UnauthorizedException('Credintials are not valid');
    return user;
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOneByEmail(createUserDto.email);
    } catch (error) {
      return;
    }
    throw new ConflictException('Email Already Exists.');
  }
}
