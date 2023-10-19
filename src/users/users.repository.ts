import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersRepository {
  private readonly logger: Logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(dto: Omit<User, '_id'>): Promise<User> {
    const createdUser = new this.userModel({
      ...dto,
      _id: new Types.ObjectId(),
    });
    const savedUser = await createdUser.save();
    this.logger.log(`A user with has been created: ${savedUser}`);
    return savedUser;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email }, {}, { lean: true })
      .exec();

    if (!user) {
      this.logger.warn(`Could not find a user with email: ${email}`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async userExists(email: string, phone: string) {
    return this.userModel.exists({ $or: [{ email }, { phone }] }).exec();
  }
}
