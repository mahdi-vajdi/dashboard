import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { User } from './models/user.schema';
import { OperatorsService } from 'src/operators/operators.service';

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
    console.log('user exists: ' + exists);
    if (exists) throw new ConflictException('Email or phone is duplicate');

    const user = await this.usersRepository.create({
      ...createUserDto,
      createdAt: new Date(),
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    // create default operator with user info
    await this.operatorsService.createDefaultOperator(user);

    return user;
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
}
