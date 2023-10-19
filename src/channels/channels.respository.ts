import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Channel, ChannelDocument } from './models/channel.schema';
import { Model, Types, UpdateQuery } from 'mongoose';
import { Operator } from 'src/operators/models/operator.schema';
import { ChannelSettingsEnum } from './channel-settings/channel-settings.enum';
import { ChannelSettings } from './models/channel-settings.schema';

@Injectable()
export class ChannelsRepository {
  private readonly logger = new Logger(ChannelsRepository.name);

  constructor(
    @InjectModel(Channel.name)
    private readonly channelModel: Model<Channel>,
  ) {}

  async create(dto: Omit<Channel, '_id'>): Promise<Channel> {
    const createdChannel = new this.channelModel({
      ...dto,
      _id: new Types.ObjectId(),
    });
    const savedChannel = await createdChannel.save();

    this.logger.log(
      `New Channel with id: ${savedChannel._id} for user: ${savedChannel.owner} has been created.`,
    );

    return savedChannel;
  }

  async findAllByUserId(userId: Types.ObjectId) {
    return await this.channelModel
      .find({ owner: userId }, {}, { lean: true })
      .populate<{ operators: Operator }>('operators')
      .exec();
  }

  async findOneById(id: string) {
    const channel = await this.channelModel
      .findById(new Types.ObjectId(id), {}, { lean: true })
      .populate<{ operators: Operator }>('operators')
      .exec();

    if (!channel) throw new NotFoundException('Channel not found');

    return channel;
  }

  async updateOneById(
    userId: Types.ObjectId,
    _id: string,
    updateQuery: UpdateQuery<ChannelDocument>,
  ) {
    const updatedChannel = await this.channelModel
      .findOneAndUpdate({ _id, owner: userId }, updateQuery, {
        lean: true,
        new: true,
      })
      .exec();

    if (!updatedChannel) throw new NotFoundException('Channel not found');

    return updatedChannel;
  }

  async updateSettings(
    userId: Types.ObjectId,
    channelId: string,
    section: ChannelSettingsEnum,
    updateDto: UpdateQuery<ChannelSettings>,
  ) {
    const updatedChannel = this.channelModel
      .findOneAndUpdate(
        {
          owner: userId,
          _id: channelId,
        },
        { [`settings.${section}`]: updateDto },
        { new: true, lean: true },
      )
      .exec();

    if (!updatedChannel) throw new NotFoundException('Channel not found');

    return updatedChannel;
  }
}
