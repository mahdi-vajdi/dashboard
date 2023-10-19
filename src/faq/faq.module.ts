import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Faq, FaqSchema } from './entities/faq.schema';
import { FaqRepository } from './faq.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Faq.name, schema: FaqSchema }])],
  controllers: [FaqController],
  providers: [FaqService, FaqRepository],
})
export class FaqModule {}
