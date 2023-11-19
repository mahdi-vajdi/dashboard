import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Operator } from './models/operator.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  ProjectionType,
  Types,
  UpdateQuery,
} from 'mongoose';

@Injectable()
export class OperatorsRepository {
  private readonly logger = new Logger(OperatorsRepository.name);

  constructor(
    @InjectModel(Operator.name) private readonly operatorModel: Model<Operator>,
  ) {}

  async create(dto: Omit<Operator, '_id'>) {
    const createdOperator = new this.operatorModel({
      ...dto,
      _id: new Types.ObjectId(),
    });
    const savedOperator = await createdOperator.save();
    this.logger.log(
      `New operator with id: ${savedOperator._id} for user: ${savedOperator.admin} has been created.`,
    );
    return savedOperator;
  }

  async find(
    filterQuery: FilterQuery<Operator>,
    fields: ProjectionType<Operator> = {},
  ) {
    return await this.operatorModel
      .find(filterQuery, fields, { lean: true })
      .exec();
  }

  async findOne(
    filterQuery: FilterQuery<Operator>,
    fields: ProjectionType<Operator> = {},
  ) {
    const operator = await this.operatorModel
      .findOne(filterQuery, fields, { lean: true })
      .exec();

    if (!operator) throw new NotFoundException('Operator not found');

    return operator;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<Operator>,
    updateQuery: UpdateQuery<Operator>,
  ) {
    const updatedOperator = await this.operatorModel
      .findOneAndUpdate(filterQuery, updateQuery, {
        lean: true,
        new: true,
      })
      .exec();
    if (!updatedOperator) {
      this.logger.warn(`Could not find operator with criteria: ${filterQuery}`);
      throw new NotFoundException('Operator not found');
    }
    return updatedOperator;
  }

  async deleteOne(userId: string, _id: string) {
    const deletedOperator = await this.operatorModel
      .deleteOne({ admin: userId, _id }, { lean: true })
      .exec();

    if (!deletedOperator) {
      throw new NotFoundException('Operator not found');
    }

    this.logger.log(
      `Operator with id: ${_id} for user: ${userId} has been deleted.`,
    );

    return { message: 'Operator has been deleted successfully' };
  }

  async operatorsExists(email: string, phone: string) {
    return this.operatorModel
      .exists({
        $or: [{ email }, { phone }],
      })
      .exec();
  }
}
