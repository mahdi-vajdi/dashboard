import { IsMongoId } from 'class-validator';

export class DeleteTeamDto {
  @IsMongoId()
  channelId: string;

  @IsMongoId()
  teamId: string;
}
