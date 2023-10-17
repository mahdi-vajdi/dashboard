import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Operator } from 'src/operators/models/operator.schema';

export type TeamDocument = HydratedDocument<Team>;

@Schema({ versionKey: false })
export class Team {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  channel: Types.ObjectId;

  @Prop()
  isDefault: boolean;

  @Prop()
  title: string;

  @Prop()
  logo: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updateAt: Date;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Operator.name }] })
  operators: Types.ObjectId[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
