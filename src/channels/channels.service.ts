import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelMainSettingsDto } from './dto/channel-settings/update-main-settings.dto';
import { ChannelsRepository } from './channels.respository';
import * as crypto from 'crypto';
import { channelDefaultSetting } from './channel-settings/channel-dafault-setting';
import { OperatorsService } from 'src/operators/operators.service';
import { ChannelSettingsEnum } from './channel-settings/channel-settings.enum';
import { UpdateChannelWidgetSettingsDto } from './dto/channel-settings/update-widget-settings.dto';
import { TeamsService } from 'src/teams/teams.service';
import { JwtPayload } from 'src/auth/auth.service';
import { Types } from 'mongoose';
import { UpdateChannelOperatorsDto } from './dto/update-operators.dto';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly channelsRepository: ChannelsRepository,
    private readonly operatorsService: OperatorsService,
    private readonly teamsService: TeamsService,
  ) {}

  async create(currentUser: JwtPayload, createChannelDto: CreateChannelDto) {
    const operators =
      createChannelDto.addAllOperators === false
        ? []
        : (await this.operatorsService.findAllByUser(currentUser)).map(
            (operator) => operator._id,
          );

    const channel = await this.channelsRepository.create({
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: new Types.ObjectId(currentUser.sub),
      title: createChannelDto.title,
      url: createChannelDto.url,
      token: crypto.randomUUID(),
      isEnabled: true,
      operators: operators,
      settings: channelDefaultSetting,
    });

    // Create a default team for the channel
    await this.teamsService.create(
      {
        channelId: channel._id.toHexString(),
        title: channel.title,
        logo: 'default',
        operators: operators.map((operator) => operator.toHexString()),
      },
      true,
    );

    return channel;
  }

  async findAllByUser(currentUser: JwtPayload) {
    return this.channelsRepository.findAll({ owner: currentUser.sub });
  }

  async findOneById(_id: string) {
    return this.channelsRepository.findOne({ _id });
  }

  async updateChannelOperators(
    currentUser: JwtPayload,
    channelId: string,
    dto: UpdateChannelOperatorsDto,
  ) {
    const channel = await this.channelsRepository.findOneAndUpdate(
      { owner: currentUser.sub, _id: channelId },
      dto,
    );
    return {
      message: 'Successfully updated operators for the channel',
      operators: channel.operators,
    };
  }

  async updateMainSettings(
    currentUser: JwtPayload,
    id: string,
    dto: UpdateChannelMainSettingsDto,
  ) {
    return this.channelsRepository.updateSettings(
      currentUser.sub,
      id,
      ChannelSettingsEnum.Main,
      dto,
    );
  }

  async updateWidgetSettings(
    currentUser: JwtPayload,
    id: string,
    dto: UpdateChannelWidgetSettingsDto,
  ) {
    return this.channelsRepository.updateSettings(
      currentUser.sub,
      id,
      ChannelSettingsEnum.Widget,
      dto,
    );
  }
}
