import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team } from './models/team.schema';
import { Model, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class TeamsRepository {
  private readonly logger = new Logger(TeamsRepository.name);

  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
  ) {}

  async create(dto: Omit<Team, '_id'>) {
    const createdTeam = new this.teamModel({
      ...dto,
      _id: new Types.ObjectId(),
    });
    const savedTeam = await createdTeam.save();
    this.logger.log(
      `New team with id: ${savedTeam._id} for channel: ${savedTeam.channel} has been created.`,
    );

    return savedTeam;
  }

  async findAll(channelId: string) {
    const teams = this.teamModel
      .find({ channel: channelId }, {}, { lean: true })
      .exec();

    // In case there are not teams found; wich is a bug!!
    if (!teams) {
      this.logger.error(
        `No teams found for channel ${channelId}. There should be at least 1 team(default team).`,
      );
      throw new NotFoundException(
        'Could not find any teams. Please create one!',
      );
    }

    return teams;
  }

  async updateOne(channelId: string, teamId: string, dto: UpdateQuery<Team>) {
    const updatedTeam = await this.teamModel
      .findOneAndUpdate({ channel: channelId, _id: teamId }, dto, {
        new: true,
        lean: true,
      })
      .exec();

    if (!updatedTeam)
      throw new NotFoundException(
        `Could not find any teams with criteria channelId: ${channelId} and teamId: ${teamId}`,
      );

    return updatedTeam;
  }

  async deleteOneById(channelId: string, teamId: string) {
    const deletedTeam = await this.teamModel
      .deleteOne({
        channel: channelId,
        _id: teamId,
      })
      .exec();

    if (!deletedTeam)
      throw new NotFoundException(
        `Could not find any teams with criteria channelId: ${channelId} and teamId: ${teamId}`,
      );

    this.logger.log(
      `the team with id: ${teamId} for channel: ${channelId} has been deleted.`,
    );
    return { message: 'Deleted team successfully' };
  }
}
