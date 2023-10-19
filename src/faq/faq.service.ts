import { Injectable } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqRepository } from './faq.repository';
import { Types } from 'mongoose';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  async create(dto: CreateFaqDto) {
    return this.faqRepository.create({
      ...dto,
      channel: new Types.ObjectId(dto.channel),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll(channelId: string) {
    return this.faqRepository.findAllByChannelId(channelId);
  }

  async findOne(id: string, channelId: string) {
    return this.faqRepository.findOne(id, channelId);
  }

  async update(id: string, channelId: string, dto: UpdateFaqDto) {
    return this.faqRepository.updateOneById(id, channelId, dto);
  }

  async delete(id: string, channelId: string) {
    return this.faqRepository.deleteOneById(id, channelId);
  }
}
