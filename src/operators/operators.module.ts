import { Module } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { OperatorsController } from './operators.controller';
import { OperatorsRepository } from './operators.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Operator, OperatorSchema } from './models/operator.schema';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Operator.name, schema: OperatorSchema },
    ]),
    ChannelsModule,
  ],
  controllers: [OperatorsController],
  providers: [OperatorsService, OperatorsRepository],
  exports: [OperatorsService],
})
export class OperatorsModule {}
