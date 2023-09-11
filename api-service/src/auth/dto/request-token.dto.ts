import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class RequestToken {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
