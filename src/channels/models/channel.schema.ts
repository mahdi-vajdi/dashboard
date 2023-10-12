import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { ChannelSettings } from './channel-settings.schema';

export const CHANNEL_COLLECTION_NAME = 'channels';

@Schema({ collection: CHANNEL_COLLECTION_NAME, versionKey: false })
export class Channel {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  owner: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  token: string;

  @Prop()
  isEnabled: boolean;

  @Prop({ type: [SchemaTypes.ObjectId] })
  operators: Types.ObjectId[];

  @Prop({ type: ChannelSettings })
  settings: ChannelSettings;
}

export const ChannelsSchema = SchemaFactory.createForClass(Channel);
