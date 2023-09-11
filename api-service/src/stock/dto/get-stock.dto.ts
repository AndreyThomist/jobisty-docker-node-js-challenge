import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetStockDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  q: string;
}
