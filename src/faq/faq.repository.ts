import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Faq } from './entities/faq.schema';
import { Model, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class FaqRepository {
  private readonly logger = new Logger(FaqRepository.name);

  constructor(@InjectModel(Faq.name) private readonly faqModel: Model<Faq>) {}

  async create(dto: Omit<Faq, '_id'>) {
    const faq = new this.faqModel({ ...dto, _id: new Types.ObjectId() });
    const saved = await faq.save({});
    this.logger.log(
      `New Faq with id: ${saved._id} for channel: ${saved.channel} has been created.`,
    );
    return saved;
  }

  async findAllByChannelId(channelId: string) {
    return this.faqModel
      .find({ channel: new Types.ObjectId(channelId) }, {}, { lean: true })
      .exec();
  }

  async findOne(_id: string, channelId: string) {
    const faq = await this.faqModel
      .findOne({ _id, channel: channelId }, {}, { lean: true })
      .exec();
    if (!faq)
      throw new NotFoundException('Could not find a faq with given criteria');
    return faq;
  }

  async updateOneById(
    _id: string,
    channelId: string,
    update: UpdateQuery<Omit<Faq, 'channel'>>,
  ) {
    const faq = this.faqModel
      .findOneAndUpdate({ _id, channel: channelId }, update, {
        new: true,
        lean: true,
      })
      .exec();

    if (!faq)
      throw new NotFoundException(
        "There is't any faq with given criteria to update",
      );

    return faq;
  }

  async deleteOneById(_id: string, channelId: string) {
    const faq = this.faqModel.deleteOne({ _id, channel: channelId }).exec();

    if (!faq)
      throw new NotFoundException(
        "There is't any faq with given criteria to delete",
      );

    this.logger.log(
      `Faq with id: ${_id} for channel: ${channelId} has been deleted.`,
    );

    return { message: 'The Faq has been deleted successfully' };
  }
}
