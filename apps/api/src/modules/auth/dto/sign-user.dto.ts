import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignInUserDto {

    @ApiProperty({
        example: '57310123456789'
    })
    @IsString()
    contactUid: string;

    @ApiProperty({
        example: 'dani123'
    })
    @IsString()
    password: string;
}