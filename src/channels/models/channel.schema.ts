import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import {
  ChannelSettings,
  ChannelSettingsSchema,
} from './channel-settings.schema';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({ versionKey: false })
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

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Operator' }] })
  operators: Types.ObjectId[];

  @Prop({ type: ChannelSettingsSchema })
  settings: ChannelSettings;
}

export const ChannelsSchema = SchemaFactory.createForClass(Channel);
