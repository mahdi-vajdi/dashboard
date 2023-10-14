import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Operator } from './models/operator.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class OperatorsRepository {
  private readonly logger = new Logger(OperatorsRepository.name);

  constructor(
    @InjectModel(Operator.name) private readonly operatorModel: Model<Operator>,
  ) {}

  async create(operator: Omit<Operator, '_id'>) {
    try {
      const createdOperator = new this.operatorModel({
        ...operator,
        _id: new Types.ObjectId(),
      });
      const savedOperator = await createdOperator.save();
      this.logger.log(
        `New operator with id: ${savedOperator._id} for user: ${savedOperator.admin} has been created.`,
      );
      return savedOperator;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Could not create operator',
        error,
      });
    }
  }

  async findAllByUserId(userId: Types.ObjectId) {
    try {
      return await this.operatorModel
        .find({ admin: userId }, {}, { lean: true })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Something went wrong',
        error: error,
      });
    }
  }

  async findOneById(userId: Types.ObjectId, _id: string) {
    try {
      return await this.operatorModel
        .findOne({
          admin: new Types.ObjectId(userId),
          _id,
        })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Something went wrong',
        error,
      });
    }
  }

  async updateOne(
    userId: Types.ObjectId,
    _id: string,
    updateQuery: UpdateQuery<Operator>,
  ) {
    try {
      const updatedOperator = await this.operatorModel
        .findOneAndUpdate(
          {
            admin: userId,
            _id,
          },
          updateQuery,
          { lean: true, new: true },
        )
        .exec();
      if (!updatedOperator) {
        this.logger.warn(`Operator not found with id: ${_id}`);
        throw new NotFoundException('Operator not found');
      }
      return updatedOperator;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Could not update channel',
        error,
      });
    }
  }

  async findOneAndDelete(userId: Types.ObjectId, _id: string) {
    const deletedOperator = await this.operatorModel.findOneAndDelete(
      { admin: userId, _id },
      { lean: true },
    );
    if (!deletedOperator) {
      this.logger.warn(`Operator not found with id: ${_id}`);
      throw new NotFoundException('Operator not found');
    }
    return deletedOperator;
  }

  async operatorsExists(email: string, phone: string) {
    return this.operatorModel.exists({
      $or: [{ email }, { phone }],
    });
  }
}
