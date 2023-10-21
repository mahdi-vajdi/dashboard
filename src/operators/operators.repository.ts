import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Operator } from './models/operator.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';

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

  async findAllByUserId(userId: string) {
    return await this.operatorModel
      .find({ admin: userId }, {}, { lean: true })
      .exec();
  }

  async findOneById(userId: string, _id: string) {
    const operator = await this.operatorModel
      .findOne({ admin: new Types.ObjectId(userId), _id }, {}, { lean: true })
      .exec();

    if (!operator) throw new NotFoundException('Operator not found');

    return operator;
  }

  async updateOne(
    userId: string,
    _id: string,
    updateQuery: UpdateQuery<Operator>,
  ) {
    const updatedOperator = await this.operatorModel
      .findOneAndUpdate({ admin: userId, _id }, updateQuery, {
        lean: true,
        new: true,
      })
      .exec();
    if (!updatedOperator) {
      this.logger.warn(`Could not find operator with id: ${_id}`);
      throw new NotFoundException('Operator not found');
    }
    return updatedOperator;
  }

  async findOneAndDelete(userId: string, _id: string) {
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
