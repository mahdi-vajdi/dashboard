import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from 'src/auth/guards/http-jwt.guard';
import { DeleteTeamDto } from './dto/delete-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  async findAll(@Query('channel') channelId: string) {
    return this.teamsService.findAll(channelId);
  }

  @Patch(':id')
  update(
    @Param('id') teamId: string,
    @Query('channel') channelId: string,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.teamsService.update(channelId, teamId, dto);
  }

  @Delete()
  remove(@Body() dto: DeleteTeamDto) {
    return this.teamsService.remove(dto);
  }
}