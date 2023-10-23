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
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { DeleteTeamDto } from './dto/delete-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ParseMongoIdPipe } from 'src/common/parse-objectId.pipe';

@UseGuards(AccessTokenGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  async findAll(@Query('channel', ParseMongoIdPipe) channelId: string) {
    return this.teamsService.findAll(channelId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) teamId: string,
    @Query('channel', ParseMongoIdPipe) channelId: string,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.teamsService.update(channelId, teamId, dto);
  }

  @Delete()
  remove(@Body() dto: DeleteTeamDto) {
    return this.teamsService.remove(dto);
  }
}
