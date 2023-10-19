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

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  owner: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  isEnabled: boolean;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'Operator' }],
    required: true,
  })
  operators: Types.ObjectId[];

  @Prop({ type: ChannelSettingsSchema, required: true })
  settings: ChannelSettings;
}

export const ChannelsSchema = SchemaFactory.createForClass(Channel);
