import {
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
  IsNotEmpty,
} from 'class-validator';
import { ROLE } from '../../entities/role.enum';

export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({ minLength: 8, minNumbers: 2, minSymbols: 1 })
  password: string;
  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;
}
