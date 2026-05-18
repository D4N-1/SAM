import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateAuthDto {

    @ApiProperty({
        example: '310123456789@s.whatsapp.net'
    })
    @IsString()
    contactUid: string;

    @ApiProperty({
        example: 'dani123'
    })
    @IsString()
    password: string;
}