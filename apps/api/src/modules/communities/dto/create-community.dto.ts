import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";


export class CreateCommunityDto {

    @ApiProperty({
        example: DTO.GROUP_UID
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    uid: string


    @ApiProperty({
        example: 'SAM x Comunidad',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;


    @ApiProperty({
        example: DTO.OPTIONAL_UNIX
    })
    @IsNumber()
    @IsOptional()
    nameTime?: number;


    @ApiProperty({
        example: DTO.UID
    })
    @IsOptional()
    @IsString()
    nameOwnerUid?: string


    @ApiProperty({
        example: DTO.SIZE
    })
    @IsNotEmpty()
    @IsNumber()
    size: number;


    @ApiProperty({
        example: DTO.UNIX
    })
    @IsNotEmpty()
    @IsNumber()
    creation: number;


    @ApiProperty({
        example: DTO.UID
    })
    @IsOptional()
    @IsString()
    ownerUid?: string;



    @ApiProperty({
        example: 'Bienvenidos a la comunidad de SAM'
    })
    @IsString()
    @IsOptional()
    @MaxLength(2048)
    description?: string;


    @ApiProperty({
        example: DTO.UID
    })
    @IsOptional()
    @IsString()
    descriptionOwnerUid?: string;


    @ApiProperty({
        example: DTO.LINK
    })
    @IsOptional()
    @IsString()
    @MaxLength(256)
    invitationLink?: string;


    @ApiProperty({
        example: DTO.BOOLEAN
    })
    @IsOptional()
    @IsBoolean()
    publicLink: boolean;

}