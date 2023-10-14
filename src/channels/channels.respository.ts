import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Channel } from './models/channel.schema';
import { Model, Types, UpdateQuery } from 'mongoose';
import { Operator } from 'src/operators/models/operator.schema';

@Injectable()
export class ChannelsRepository {
  protected readonly logger = new Logger(ChannelsRepository.name);

  constructor(
    @InjectModel(Channel.name)
    private readonly channelModel: Model<Channel>,
  ) {}

  async create(document: Omit<Channel, '_id'>): Promise<Channel> {
    try {
      const createdChannel = new this.channelModel({
        ...document,
        _id: new Types.ObjectId(),
      });
      const savedChannel = await createdChannel.save();
      this.logger.log(
        `New Channel with id: ${savedChannel._id} for user: ${savedChannel.owner} has been created.`,
      );
      return savedChannel;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Could not create channel',
        error,
      });
    }
  }

  async findAllByUserId(userId: Types.ObjectId) {
    try {
      return await this.channelModel
        .find({ owner: userId }, {}, { lean: true })
        .populate<{ operators: Operator }>('operators')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Something went wrong',
        error,
      });
    }
  }

  async findOneById(id: string) {
    try {
      const channels = await this.channelModel
        .findById(new Types.ObjectId(id), {}, { lean: true })
        .populate<{ operators: Operator }>('operators')
        .exec();
      console.log(channels);
      return channels;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Something went wrong',
        error,
      });
    }
  }

  async updateOneById(_id: string, updateQuery: UpdateQuery<Channel>) {
    try {
      const updatedChannel = await this.channelModel
        .findByIdAndUpdate({ _id }, updateQuery, {
          lean: true,
          new: true,
        })
        .exec();
      if (!updatedChannel) {
        this.logger.warn(`Channel not found with id: ${_id}`);
        throw new NotFoundException('Cahnnel not found');
      }
      return updatedChannel;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Could not update channel',
        error,
      });
    }
  }
}
