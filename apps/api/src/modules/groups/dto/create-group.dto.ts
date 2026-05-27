import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";

export class CreateGroupDto {

    @ApiProperty({
        description: 'El UID de la comunidad que pertenece (opcional)',
        example: DTO.OPTIONAL_GROUP_UID
    })
    @IsString()
    @IsOptional()
    communityUid?: string;

    @ApiProperty({
        description: 'El UID del grupo',
        example: DTO.GROUP_UID
    })
    @IsString()
    @IsNotEmpty()
    uid: string;

    @ApiProperty({
        description: 'El nombre del grupo',
        example: 'SAM x Grupo',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Fecha del ultimo cambio al nombre del grupo en UNIX (opcional)',
        example: DTO.OPTIONAL_UNIX
    })
    @IsOptional()
    @IsNumber()
    nameTime?: number;

    @ApiProperty({
        description: 'El UID del contacto del autor del nombre (opcional)',
        example: DTO.OPTIONAL_UID
    })
    @IsOptional()
    @IsString()
    nameOwnerUid?: string;

    @ApiProperty({
        description: 'La cantidad de miembros del grupo',
        example: DTO.SIZE
    })
    @IsNumber()
    @IsNotEmpty()
    size: number;


    @ApiProperty({
        description: 'Fecha de creación del grupo en UNIX',
        example: DTO.UNIX
    })
    @IsNumber()
    @IsNotEmpty()
    creation: number;

    @ApiProperty({
        description: 'El UID del contacto dueño del grupo',
        example: DTO.OPTIONAL_UID
    })
    @IsString()
    @IsOptional()
    ownerUid?: string;


    @ApiProperty({
        description: 'La descripción del grupo',
        example: 'Bienvenidos al grupo de SAM (opcional)'
    })
    @IsOptional()
    @IsString()
    @MaxLength(1024)
    description?: string;

    @ApiProperty({
        description: 'El UID del contacto autor de la descripción (opcional)',
        example: DTO.UID
    })
    @IsString()
    @IsOptional()
    descriptionOwnerUid?: string;

    @ApiProperty({
        description: 'Si el grupo puede ser editado por cualquier miembro (opcional)',
        example: DTO.BOOLEAN
    })
    @IsBoolean()
    @IsOptional()
    restrict?: boolean;

    @ApiProperty({
        description: 'Solo admins pueden enviar mensajes (opcional)',
        example: DTO.BOOLEAN
    })
    @IsBoolean()
    @IsOptional()
    announce?: boolean;
    
}
