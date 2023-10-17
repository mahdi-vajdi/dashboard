import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsRepository } from './teams.repository';
import { Types } from 'mongoose';
import { DeleteTeamDto } from './dto/delete-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async create(dto: CreateTeamDto, isDefaultTeam = false) {
    return await this.teamsRepository.create({
      channel: new Types.ObjectId(dto.channelId),
      isDefault: isDefaultTeam,
      title: dto.title,
      logo: dto.logo,
      createdAt: new Date(),
      updateAt: new Date(),
      operators: dto.operators.map((operator) => new Types.ObjectId(operator)),
    });
  }

  async findAll(channelId: string) {
    return this.teamsRepository.findAll(channelId);
  }

  update(channelId: string, teamId: string, dto: UpdateTeamDto) {
    return this.teamsRepository.update(channelId, teamId, dto);
  }

  async remove({ channelId, teamId }: DeleteTeamDto) {
    return this.teamsRepository.deleteOneById(channelId, teamId);
  }
}
