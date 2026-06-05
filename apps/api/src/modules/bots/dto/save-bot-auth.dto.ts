import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DTO } from 'src/common/constants/generic.dto';
import { IsStringOrObject } from 'src/common/utils/class-validator';

export class SaveAuthDto {

  @ApiProperty({
    description: 'El UID del bot',
    example: DTO.UID,
  })
  @IsString()
  @IsNotEmpty()
  botUid: string;

  @ApiProperty({
    description: 'El identificador o tipo de la llave criptográfica',
    example: 'creds',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'El objeto o string con los datos criptográficos que envía Baileys',
    example: { noiseKey: { private: '...', public: '...' } },
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}