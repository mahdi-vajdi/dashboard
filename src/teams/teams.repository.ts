import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team } from './models/team.schema';
import { Model, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class TeamsRepository {
  private readonly logger = new Logger(TeamsRepository.name);

  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
  ) {}

  async create(document: Omit<Team, '_id'>) {
    try {
      const createdTeam = new this.teamModel({
        ...document,
        _id: new Types.ObjectId(),
      });
      const savedTeam = await createdTeam.save();
      this.logger.log(
        `New Channel with id: ${savedTeam._id} for channel: ${savedTeam.channel} has been created.`,
      );
      return savedTeam;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Something went Wrong.',
        error,
      });
    }
  }

  async findAll(channelId: string) {
    try {
      const teams = this.teamModel.find(
        { channel: channelId },
        {},
        { lean: true },
      );

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
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Something went Wrong.',
        error,
      });
    }
  }

  async update(channelId: string, teamId: string, dto: UpdateQuery<Team>) {
    try {
      const updatedTeam = await this.teamModel.findOneAndUpdate(
        { channel: channelId, _id: teamId },
        dto,
        {
          new: true,
          lean: true,
        },
      );

      if (!updatedTeam)
        throw new NotFoundException(
          `Could not find any teams with criteria channelId: ${channelId} and teamId: ${teamId}`,
        );

      return updatedTeam;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Something went Wrong.',
        error,
      });
    }
  }

  async deleteOneById(channelId, teamId: string) {
    try {
      const deletedTeam = await this.teamModel.deleteOne({
        channel: channelId,
        _id: teamId,
      });
      if (!deletedTeam)
        throw new NotFoundException(
          `Could not find any teams with criteria channelId: ${channelId} and teamId: ${teamId}`,
        );

      return { message: 'Deleted team successfully' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Something went Wrong.',
        error,
      });
    }
  }
}
