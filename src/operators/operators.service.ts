import { Injectable } from '@nestjs/common';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { OperatorsRepository } from './operators.repository';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/models/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class OperatorsService {
  constructor(private readonly operatorsRepository: OperatorsRepository) {}

  async create(currentUser: User, createOperatorDto: CreateOperatorDto) {
    return this.operatorsRepository.create({
      createdAt: new Date(),
      updatedAt: new Date(),
      email: createOperatorDto.email,
      phone: createOperatorDto.phone,
      title: createOperatorDto.title,
      name: createOperatorDto.name,
      password: await bcrypt.hash(createOperatorDto.password, 10),
      avatar: 'default',
      online: false,
      channels: createOperatorDto.channelIds?.map(
        (channelId) => new Types.ObjectId(channelId),
      ),
      admin: currentUser._id,
      role: createOperatorDto.role,
    });
  }

  async findAll(currentUser: User) {
    return this.operatorsRepository.findAllByUserId(currentUser._id);
  }

  async findOne(user: User, id: string) {
    return this.operatorsRepository.findOneById(user._id, id);
  }

  async update(
    currentUser: User,
    id: string,
    updateOperatorDto: UpdateOperatorDto,
  ) {
    return this.operatorsRepository.updateOne(
      currentUser._id,
      id,
      updateOperatorDto,
    );
  }

  async remove(currentUser: User, _id: string) {
    return this.operatorsRepository.findOneAndDelete(currentUser._id, _id);
  }
}
