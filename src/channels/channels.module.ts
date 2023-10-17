import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsRepository } from './channels.respository';
import { ChannelsService } from './channels.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelsSchema } from './models/channel.schema';
import { OperatorsModule } from 'src/operators/operators.module';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelsSchema }]),
    OperatorsModule,
    TeamsModule,
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsRepository],
  exports: [ChannelsService],
})
export class ChannelsModule {}
