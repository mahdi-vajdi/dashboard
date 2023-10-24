import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class InfoFrom {
  @IsBoolean()
  isEnabled: boolean;

  @IsBoolean()
  isOptional: boolean;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class ChannelMainSettingsDto {
  @IsString()
  @IsNotEmpty()
  logo: string;

  @IsBoolean()
  seeWhileTyping: boolean;

  @IsBoolean()
  sendVoice: boolean;

  @IsBoolean()
  showRaychatCredit: boolean;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => InfoFrom)
  infoForm: InfoFrom;
}
