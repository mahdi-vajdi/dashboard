import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';

@Schema({ _id: false })
class Question {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema({ versionKey: false })
export class Faq {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  channel: Types.ObjectId;

  @Prop({ required: true })
  isEnabled: boolean;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [QuestionSchema], required: true })
  questions: Question[];
}

export const FaqSchema = SchemaFactory.createForClass(Faq);
