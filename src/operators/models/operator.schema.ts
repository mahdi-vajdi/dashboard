import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, HydratedDocument } from 'mongoose';
import { OperatorRoles } from '../operator-role.enum';
import { User } from 'src/users/models/user.schema';
import { Channel } from 'diagnostics_channel';

export type OperatorDocument = HydratedDocument<Operator>;

@Schema({ versionKey: false })
export class Operator {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  online: boolean;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: Channel.name }],
    required: true,
  })
  channels: Types.ObjectId[];

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  admin: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(OperatorRoles),
    required: true,
  })
  role: OperatorRoles;
}

export const OperatorSchema = SchemaFactory.createForClass(Operator);
