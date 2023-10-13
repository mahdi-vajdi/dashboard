import {
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
  @IsMongoId({ each: true, message: 'give me some mongodb ids!' })
  channelIds: string[];

  @IsEnum(OperatorRoles)
  role: OperatorRoles;
}
