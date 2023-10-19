import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Operator } from 'src/operators/models/operator.schema';

export type TeamDocument = HydratedDocument<Team>;

@Schema({ versionKey: false })
export class Team {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updateAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  channel: Types.ObjectId;

  @Prop({ required: true })
  isDefault: boolean;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  logo: string;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: Operator.name }],
    required: true,
  })
  operators: Types.ObjectId[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
