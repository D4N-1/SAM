import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";


export class SignInBotDto {

    @ApiProperty({
        description: 'El UID del contacto del BOT',
        example: '320987654321@s.whatsapp.net'
    })
    @IsString()
    @IsNotEmpty()
    contactUid: string;


    @ApiProperty({
        description: 'El CODIGO único de acceso',
        example: 'S4MWWBOT'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(8)
    token: string;
}