import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelsRepository } from './channels.respository';
import * as crypto from 'crypto';
import { channelDefaultSetting } from './channel-dafault-setting';
import { User } from 'src/users/models/user.schema';
import { OperatorsService } from 'src/operators/operators.service';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly channelsRepository: ChannelsRepository,
    private readonly operatorsService: OperatorsService,
  ) {}

  async create(createChannelDto: CreateChannelDto, currentUser: User) {
    const operators =
      createChannelDto.addAllOperators === false
        ? []
        : (await this.operatorsService.findAllByUser(currentUser)).map(
            (operator) => operator._id,
          );

    return this.channelsRepository.create({
      createdAt: new Date(),
      updatedAt: new Date(),
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
    return this.channelsRepository.findAllByUserId(currentUser._id);
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
