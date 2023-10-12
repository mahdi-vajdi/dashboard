import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelsRepository } from './channels.respository';
import * as crypto from 'crypto';
import { channelDefaultSetting } from './channel-dafault-setting';
import { User } from 'src/users/models/user.schema';

@Injectable()
export class ChannelsService {
  constructor(private readonly channelsRepository: ChannelsRepository) {}

  async create(createChannelDto: CreateChannelDto, currentUser: User) {
    const operators = createChannelDto.addAllOperators === false ? [] : []; // FIXME: sencond condtion should get all operators for the user
    const now = new Date();

    return this.channelsRepository.create({
      createdAt: now,
      updatedAt: now,
      owner: currentUser._id,
      title: createChannelDto.title,
      url: createChannelDto.url,
      token: crypto.randomUUID(),
      isEnabled: true,
      operators: operators,
      settings: channelDefaultSetting,
    });
  }

  async findAll(currentUser: User) {
    return this.channelsRepository.findAllByUserId(
      currentUser._id.toHexString(),
    );
  }

  async findOne(id: string) {
    return this.channelsRepository.findOneById(id);
  }

  async update(id: string, updateChannelDto: UpdateChannelDto) {
    return this.channelsRepository.updateOneById(id, {
      ...updateChannelDto,
      updatedAt: new Date(),
    });
  }
}
