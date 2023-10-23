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
import { UpdateChannelMainSettingsDto } from './dto/channel-settings/update-main-settings.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { UpdateChannelWidgetSettingsDto } from './dto/channel-settings/update-widget-settings.dto';
import { ParseMongoIdPipe } from 'src/common/parse-objectId.pipe';
import { JwtPayload } from 'src/auth/auth.service';

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
    return this.channelsService.findAll(req.user as JwtPayload);
  }

  @Get(':id')
  async findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.channelsService.findOne(id);
  }

  @Patch(':id/operators')
  async updateChannelOperators(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateChannelDto: any,
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
    @Body() updateChannelDto: UpdateChannelMainSettingsDto,
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
    @Body() updateChannelDto: UpdateChannelWidgetSettingsDto,
  ) {
    return this.channelsService.updateWidgetSettings(
      req.user as JwtPayload,
      id,
      updateChannelDto,
    );
  }
}
