import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Language } from 'src/common/languages.enum';

class Landing {
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(Language)
  laguage: Language;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  startMessage: string;

  @IsString()
  @IsNotEmpty()
  startReply: string;
}

class Customization {
  @IsString()
  @IsNotEmpty()
  logo: string;

  @IsHexColor()
  bgColor: string;

  @IsHexColor()
  loBgColor: string;

  @IsHexColor()
  secondaryColor: string;

  @IsString()
  @IsNotEmpty()
  bgTheme: string;
}

class Display {
  @IsBoolean()
  showInPagesEnabled: boolean;

  @IsArray()
  @IsUrl({}, { each: true })
  showPages: string[];

  @IsBoolean()
  hideInPagesEnabled: boolean;

  @IsArray()
  @IsUrl({}, { each: true })
  hideInPages: string[];
}

class Position {
  @IsString()
  @IsNotEmpty()
  ltrPosition: string;

  @IsNumber()
  @IsNotEmpty()
  ltrBottom: number;

  @IsNumber()
  @IsNotEmpty()
  ltrRight: number;

  @IsBoolean()
  ltrShowInMobile: boolean;

  @IsString()
  @IsNotEmpty()
  rtlPosition: string;

  @IsNumber()
  @IsNotEmpty()
  rtlBottom: number;

  @IsNumber()
  @IsNotEmpty()
  rtlLeft: number;

  @IsBoolean()
  rtlShowInMobile: boolean;
}

export class ChannelWidgetSettingsDto {
  @IsArray()
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  @Type(() => Landing)
  landings: Landing[];

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Customization)
  customization: Customization;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Display)
  display: Display;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Position)
  position: Position;
}
