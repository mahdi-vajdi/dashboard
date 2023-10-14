import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsRepository } from './channels.respository';
import { ChannelsService } from './channels.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CHANNEL_COLLECTION_NAME,
  ChannelsSchema,
} from './models/channel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CHANNEL_COLLECTION_NAME, schema: ChannelsSchema },
    ]),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsRepository],
  exports: [ChannelsService],
})
export class ChannelsModule {}
