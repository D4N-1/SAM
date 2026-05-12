import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateAuthDto {

    @ApiProperty({
        example: '3207654321'
    })
    @IsString()
    uid: string;

    @ApiProperty({
        example: 'dani123'
    })
    @IsString()
    password: string;
}