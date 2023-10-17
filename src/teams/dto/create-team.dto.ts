import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsMongoId()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  logo: string;

  @IsArray()
  @IsMongoId({ each: true })
  operators: string[];
}
