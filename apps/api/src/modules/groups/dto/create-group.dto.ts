import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";

export class CreateGroupDto {

    @ApiProperty({
        example: DTO.GROUP_UID
    })
    @IsString()
    @IsNotEmpty()
    communityUid: string;

    @ApiProperty({
        example: DTO.GROUP_UID
    })
    @IsString()
    @IsNotEmpty()
    uid: string;

    @ApiProperty({
        example: 'SAM x Grupo',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'Bienvenidos al grupo de SAM'
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;
    
}
