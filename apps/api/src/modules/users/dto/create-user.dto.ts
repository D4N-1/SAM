import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { enumRole } from "src/common/enums/role.enum";


export class CreateUserDto {

    @ApiProperty({
        example: '310123456789@s.whatsapp.net'
    })
    @IsNotEmpty()
    @IsString()
    contactUid: string;

    @ApiProperty({
        example: 'Dani'
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(25)
    name: string;

    @ApiProperty({
        example: 'Hola, soy Dani (opcional)'
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiProperty({
        example: 'JuanPhoto (opcional)'
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    imageUrl?: string;

    @ApiProperty({
        example: 'dani@gmail.com (opcional)'
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    email?: string;

    @ApiProperty({
        example: 'Dani1234'
    })
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    password: string;

    @IsOptional()
    @IsEnum(enumRole)
    roleName?: enumRole;
}