import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelMainSettingsDto } from './dto/channel-settings/update-main-settings.dto';
import { ChannelsRepository } from './channels.respository';
import * as crypto from 'crypto';
import { channelDefaultSetting } from './channel-settings/channel-dafault-setting';
import { User } from 'src/users/models/user.schema';
import { OperatorsService } from 'src/operators/operators.service';
import { ChannelSettingsEnum } from './channel-settings/channel-settings.enum';
import { UpdateChannelWidgetSettingsDto } from './dto/channel-settings/update-widget-settings.dto';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly channelsRepository: ChannelsRepository,
    private readonly operatorsService: OperatorsService,
  ) {}

  async create(currentUser: User, createChannelDto: CreateChannelDto) {
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

  async updateChannelOperators(
    currentUser: User,
    channelId: string,
    updateDto: any,
  ) {
    const channel = await this.channelsRepository.updateOneById(
      currentUser._id,
      channelId,
      updateDto,
    );
    return {
      message: 'Successfully updated operators for the channel',
      operators: channel.operators,
    };
  }

  async updateMainSettings(
    currentUser: User,
    id: string,
    dto: UpdateChannelMainSettingsDto,
  ) {
    console.log(`service dto ${JSON.stringify(dto)}`);
    return this.channelsRepository.updateSettings(
      currentUser._id,
      id,
      ChannelSettingsEnum.Main,
      dto,
    );
  }

  async updateWidgetSettings(
    currentUser: User,
    id: string,
    dto: UpdateChannelWidgetSettingsDto,
  ) {
    console.log(`service dto ${JSON.stringify(dto)}`);
    return this.channelsRepository.updateSettings(
      currentUser._id,
      id,
      ChannelSettingsEnum.Widget,
      dto,
    );
  }
}
