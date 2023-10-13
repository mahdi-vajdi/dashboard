import { Module } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { OperatorsController } from './operators.controller';
import { OperatorsRepository } from './operators.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Operator, OperatorSchema } from './models/operator.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Operator.name, schema: OperatorSchema },
    ]),
  ],
  controllers: [OperatorsController],
  providers: [OperatorsService, OperatorsRepository],
})
export class OperatorsModule {}
