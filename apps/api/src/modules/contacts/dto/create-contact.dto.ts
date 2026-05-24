import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";


export class CreateContactDto {

    @ApiProperty({
        example: '57310123456789'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(35)
    uid: string;

    @ApiProperty({
        example: '123456789@lid (opcional)'
    })
    @IsString()
    @IsOptional()
    @MaxLength(35)
    lid?: string;
    
    @ApiProperty({
        example: 'Dani (opcional)'
    })
    @IsString()
    @IsOptional()
    @MaxLength(25)
    name?: string;
}