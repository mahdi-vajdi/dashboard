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
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/http-jwt.guard';
import { User } from 'src/users/models/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  async create(
    @Body() createChannelDto: CreateChannelDto,
    @Req() req: Request,
  ) {
    return this.channelsService.create(createChannelDto, req.user as User);
  }

  @Get()
  async findAll(@Req() req: Request) {
    return this.channelsService.findAll(req.user as User);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelsService.update(id, updateChannelDto);
  }
}
