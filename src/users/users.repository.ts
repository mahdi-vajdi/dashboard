import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

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

  async findOne(filterQuery: FilterQuery<User>): Promise<User> {
    const user = await this.userModel
      .findOne(filterQuery, {}, { lean: true })
      .exec();

    if (!user)
      this.logger.warn(`Could not find a user with cirteria: ${filterQuery}`);

    return user;
  }

  async update(
    userId: Types.ObjectId | string,
    updateQuery: UpdateQuery<User>,
  ) {
    const updatedUser = this.userModel
      .findByIdAndUpdate(userId, updateQuery, {
        new: true,
        lean: true,
      })
      .exec();

    if (!updatedUser) throw new NotFoundException('Channel not found');

    return updatedUser;
  }

  async userExists(email: string, phone: string) {
    return this.userModel.exists({ $or: [{ email }, { phone }] }).exec();
  }
}
