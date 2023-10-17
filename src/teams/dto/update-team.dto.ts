import { OmitType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';

export class UpdateTeamDto extends OmitType(CreateTeamDto, ['channelId']) {}
