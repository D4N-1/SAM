import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";


export class CreateCommunityDto {

    @ApiProperty({
        example: '320987654321@g'
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    uid: string

    @ApiProperty({
        example: '320987654321@s.whatsapp.net'
    })
    @IsOptional()
    @IsString()
    ownerContactUid?: string

    @ApiProperty({
        example: 'SAM x Comunidad',
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    @ApiProperty({
        example: 'Bienvenidos a la comunidad de SAM'
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    description?: string;

    @ApiProperty({
        example: 'https://ws.invite/320987654321'
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    link?: string

    @ApiProperty({
        example: true
    })
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;
}