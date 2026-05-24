import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";


export class SignInBotDto {

    @ApiProperty({
        description: 'El UID del contacto del BOT',
        example: DTO.UID
    })
    @IsString()
    @IsNotEmpty()
    contactUid: string;


    @ApiProperty({
        description: 'El CODIGO único de acceso',
        example: DTO.CODE
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(8)
    code: string;
}