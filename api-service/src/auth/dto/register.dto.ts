import {
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
  IsNotEmpty,
} from 'class-validator';
import { ROLE } from '../../entities/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({ minLength: 8, minNumbers: 2, minSymbols: 1 })
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;
}
