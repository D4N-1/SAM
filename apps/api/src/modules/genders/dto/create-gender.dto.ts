import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";

export class CreateGenderDto {


    @ApiProperty({
        example: 'Action',
        description: 'El nombre del genero'
    })
    @IsString()
    @IsNotEmpty({ message: 'El name del genero es obligatorio' })
    @MinLength(3, { message: 'El name del genero es demasiado corto'})
    @MaxLength(20, { message: 'El name del genero es demasiado largo'})
    name: string;
}
