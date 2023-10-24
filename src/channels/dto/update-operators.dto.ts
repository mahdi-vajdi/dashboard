import { IsArray, IsMongoId } from 'class-validator';

export class UpdateChannelOperatorsDto {
  @IsArray()
  @IsMongoId({ each: true })
  operators: string[];
}
