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

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  title: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  online: boolean;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Channel.name }] })
  channels: Types.ObjectId[];

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  admin: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(OperatorRoles),
    required: true,
  })
  role: OperatorRoles;
}

export const OperatorSchema = SchemaFactory.createForClass(Operator);
