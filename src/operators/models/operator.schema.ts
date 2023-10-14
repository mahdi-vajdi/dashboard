import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, HydratedDocument } from 'mongoose';
import { OperatorRoles } from '../operator-role.enum';

export type OperatorDocument = HydratedDocument<Operator>;

@Schema()
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

  @Prop({ type: [{ type: SchemaTypes.ObjectId }] })
  channels: Types.ObjectId[]; // Reference to the websites collection

  @Prop()
  admin: Types.ObjectId; // Reference to the users collection

  @Prop({
    type: String,
    enum: Object.values(OperatorRoles),
    required: true,
  })
  role: OperatorRoles;
}

export const OperatorSchema = SchemaFactory.createForClass(Operator);
