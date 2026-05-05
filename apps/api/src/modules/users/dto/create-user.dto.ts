import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'SamAdmin' })
  @IsString()
  @IsNotEmpty()
  name: string;
}