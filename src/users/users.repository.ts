import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { USER_COLLECTION_NAME, UserDocument } from './models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersRepository {
  protected readonly logger: Logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(USER_COLLECTION_NAME)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(document: Omit<UserDocument, '_id'>): Promise<User> {
    const createdUser = new this.userModel({
      ...document,
      _id: new Types.ObjectId(),
    });
    const savedUser = await createdUser.save();
    return this.deserialize(savedUser);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      this.logger.warn(`User not found with email: ${email}`);
      throw new NotFoundException('User not found');
    }

    return this.deserialize(user);
  }

  private deserialize(user: UserDocument): User {
    return {
      id: user._id.toHexString(),
      createdAt: user.createdAt,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      password: user.password,
    };
  }
}
