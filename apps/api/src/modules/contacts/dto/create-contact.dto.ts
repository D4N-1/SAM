import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";


export class CreateContactDto {

    @ApiProperty({
        example: '310123456789@s.whatsapp.net'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(35)
    uid: string;

    @ApiProperty({
        example: '123456789@lid'
    })
    @IsString()
    @IsOptional()
    @MaxLength(35)
    lid?: string;
    
    @ApiProperty({
        example: 'Dani'
    })
    @IsString()
    @IsOptional()
    @MaxLength(25)
    name?: string;
}