import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { OperatorRoles } from '../operator-role.enum';

export class CreateOperatorDto {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  channelIds: string[];

  @IsEnum(OperatorRoles)
  role: OperatorRoles;
}
