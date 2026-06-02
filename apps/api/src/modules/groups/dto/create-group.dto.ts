import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";
import { enumEphemeralDuration } from "src/common/enums/ephemeral-duration.enum";

export class CreateGroupDto {

    @ApiProperty({
        description: 'El UID de la comunidad que pertenece (opcional)',
        example: DTO.GROUP_UID + DTO.OPTIONAL
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
        example: DTO.GROUP_NAME,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(256)
    @MinLength(2)
    name: string;

    @ApiProperty({
        description: 'Fecha del ultimo cambio al nombre del grupo en UNIX (opcional)',
        example: DTO.UNIX + DTO.OPTIONAL
    })
    @IsOptional()
    @IsNumber()
    nameTime?: number;

    @ApiProperty({
        description: 'El UID del contacto del autor del nombre (opcional)',
        example: DTO.UID + DTO.OPTIONAL
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
        example: DTO.UID + DTO.OPTIONAL
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
    @MaxLength(2048)
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

    @ApiProperty({
        description: 'Si los administradores deben aprobar el ingreso',
        example: DTO.BOOLEAN
    })
    @IsBoolean()
    @IsOptional()
    joinApprovalMode?: boolean;

    @ApiProperty({
        description: 'Si los miembros pueden añadir participantes al grupo',
        example: DTO.BOOLEAN
    })
    @IsBoolean()
    @IsOptional()
    memberAddMode?: boolean;
    
    @ApiProperty({
        description: 'La duración de los mensajes ',
        example: enumEphemeralDuration.DAY
    })
    @IsOptional()
    ephemeralDuration?: enumEphemeralDuration;

    @ApiProperty({
        description: 'El nombre del reino al que pertenece',
        example: DTO.REALM_NAME
    })
    @IsString()
    @IsOptional()
    realmName?: string;
    
}
