import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";
import { enumRole } from "src/common/enums/role.enum";


export class CreateUserDto {

    @ApiProperty({
        example: DTO.UID
    })
    @IsNotEmpty()
    @IsString()
    contactUid: string;

    @ApiProperty({
        example: DTO.NAME
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(25)
    name: string;

    @ApiProperty({
        example: DTO.DESCRIPTION
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiProperty({
        example: DTO.PHOTO
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    imageUrl?: string;

    @ApiProperty({
        example: DTO.EMAIL
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    email?: string;

    @ApiProperty({
        example: DTO.PASSWORD
    })
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    password: string;

    @IsOptional()
    @IsEnum(enumRole)
    roleName?: enumRole;
}