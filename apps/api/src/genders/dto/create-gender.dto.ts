import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class CreateGenderDto {


    @IsString()
    @IsNotEmpty({ message: 'El nombre del genero es obligatorio' })
    @MinLength(3, { message: 'El nombre del genero es demasiado corto'})
    @MaxLength(20, { message: 'El nombre del genero es demasiado largo'})
    name: string;
}
