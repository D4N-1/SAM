import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";


export class SignInBotDto {

    @ApiProperty({
        description: 'El UID del contacto del BOT',
        example: '57320987654321'
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
    code: string;
}