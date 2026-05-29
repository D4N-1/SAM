import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { DTO } from 'src/common/constants/generic.dto';

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
    description: 'El objeto con los datos criptográficos que envía Baileys',
    example: { noiseKey: { private: '...', public: '...' } },
  })
  @IsObject()
  @IsNotEmpty()
  value: Record<string, any>;
}