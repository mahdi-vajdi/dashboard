import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { OperatorsRepository } from './operators.repository';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/models/user.schema';
import { Types } from 'mongoose';
import { OperatorRoles } from './operator-role.enum';
import { JwtPayload } from 'src/auth/auth.service';

@Injectable()
export class OperatorsService {
  constructor(private readonly operatorsRepository: OperatorsRepository) {}

  async create(currentUser: JwtPayload, createOperatorDto: CreateOperatorDto) {
    // Check if operator exists
    const exists = await this.operatorsRepository.operatorsExists(
      createOperatorDto.email,
      createOperatorDto.phone,
    );
    if (exists) throw new ConflictException('Email or phone is duplicate');

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
      admin: new Types.ObjectId(currentUser.sub),
      role: createOperatorDto.role,
    });
  }

  async createDefaultOperator(user: User) {
    this.operatorsRepository.create({
      createdAt: new Date(),
      updatedAt: new Date(),
      email: user.email,
      phone: user.phone,
      title: 'مدیر',
      name: `${user.firstName} ${user.lastName}`,
      password: user.password,
      avatar: 'default',
      online: false,
      channels: [],
      admin: user._id,
      role: OperatorRoles.ADMIN,
    });
  }

  async findByAdmin(currentUser: JwtPayload) {
    return this.operatorsRepository.find({ admin: currentUser.sub });
  }

  async findOneById(currentUser: JwtPayload, _id: string) {
    return this.operatorsRepository.findOne({ admin: currentUser.sub, _id });
  }

  async findOneByIdAndUpdate(
    currentUser: JwtPayload,
    _id: string,
    dto: UpdateOperatorDto,
  ) {
    return this.operatorsRepository.findOneAndUpdate(
      { admin: currentUser.sub, id: _id },
      dto,
    );
  }

  async deleteOneById(currentUser: JwtPayload, _id: string) {
    return this.operatorsRepository.deleteOne(currentUser.sub, _id);
  }
}
