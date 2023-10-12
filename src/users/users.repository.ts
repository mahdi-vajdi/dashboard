import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { USER_COLLECTION_NAME, User } from './models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersRepository {
  protected readonly logger: Logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(USER_COLLECTION_NAME)
    private readonly userModel: Model<User>,
  ) {}

  async create(document: Omit<User, '_id'>): Promise<User> {
    try {
      const createdUser = new this.userModel({
        ...document,
        _id: new Types.ObjectId(),
      });
      const savedUser = await createdUser.save();
      this.logger.log(`A user with has been created: ${savedUser}`);
      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Could not create user',
        error,
      });
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({ email }, {}, { lean: true })
        .exec();

      if (!user) {
        this.logger.warn(`User not found with email: ${email}`);
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Something went wrong',
        error: error,
      });
    }
  }
}
