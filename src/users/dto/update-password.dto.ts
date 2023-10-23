import { IsStrongPassword } from 'class-validator';
import { AuthDto } from 'src/auth/dto/auth.dto';

export class UpdatePasswordDto extends AuthDto {
  @IsStrongPassword()
  newPassword: string;
}
