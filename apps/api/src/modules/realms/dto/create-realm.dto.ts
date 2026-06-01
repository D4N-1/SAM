import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";


export class CreateRealmDto {


    @ApiProperty({
        description: 'El nombre único del reino',
        example: DTO.REALM_NAME
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(35)
    @MinLength(3)
    name: string;

    @ApiProperty({
        description: 'El UID del bot dueño del reino',
        example: DTO.UID + DTO.OPTIONAL
    })
    @IsString()
    @IsOptional()
    botUid?: string;

}