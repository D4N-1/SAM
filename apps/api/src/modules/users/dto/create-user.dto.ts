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
        example: 'Juan'
    })
    @IsOptional()
    @IsString()
    @MaxLength(25)
    name?: string;

    @ApiProperty({
        example: 'Hola, soy Juan'
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiProperty({
        example: 'JuanPhoto'
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    imageUrl?: string;

    @ApiProperty({
        example: 'Juan123'
    })
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    password: string;

    @IsNotEmpty()
    @IsEnum(enumRole)
    roleName: enumRole;
}