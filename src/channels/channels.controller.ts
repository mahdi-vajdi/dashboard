import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelMainSettingsDto } from './dto/channel-settings/main-settings.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { ChannelWidgetSettingsDto } from './dto/channel-settings/widget-settings.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-objectId.pipe';
import { JwtPayload } from 'src/auth/auth.service';
import { UpdateChannelOperatorsDto } from './dto/update-operators.dto';

@UseGuards(AccessTokenGuard)
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return this.channelsService.create(
      req.user as JwtPayload,
      createChannelDto,
    );
  }

  @Get()
  async findAll(@Req() req: Request) {
    return this.channelsService.findAllByUser(req.user as JwtPayload);
  }

  @Get(':id')
  async findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.channelsService.findOneById(id);
  }

  @Patch(':id/operators')
  async updateChannelOperators(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateChannelDto: UpdateChannelOperatorsDto,
  ) {
    return this.channelsService.updateChannelOperators(
      req.user as JwtPayload,
      id,
      updateChannelDto,
    );
  }

  @Patch(':id/settings/main')
  async updateMainSettings(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateChannelDto: ChannelMainSettingsDto,
  ) {
    return this.channelsService.updateMainSettings(
      req.user as JwtPayload,
      id,
      updateChannelDto,
    );
  }

  @Patch(':id/settings/widget')
  async updateWidgetSettings(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateChannelDto: ChannelWidgetSettingsDto,
  ) {
    return this.channelsService.updateWidgetSettings(
      req.user as JwtPayload,
      id,
      updateChannelDto,
    );
  }
}
