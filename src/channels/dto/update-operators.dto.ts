import { IsArray, IsMongoId } from 'class-validator';

export class updateChannelOperatorsDto {
  @IsArray()
  @IsMongoId({ each: true })
  operators: string[];
}
