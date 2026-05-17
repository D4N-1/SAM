import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateCommunityDto {

    @ApiProperty({
        example: '320987654321@g'
    })
    @IsNotEmpty()
    @IsString()
    uid: string

    @ApiProperty({
        example: 'SAM x Comunidad',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'Bienvenidos a la comunidad de SAM'
    })
    @IsString()
    @IsNotEmpty()
    description?: string;

    @ApiProperty({
        example: 'https://ws.invite/320987654321'
    })
    @IsString()
    @IsOptional()
    link?: string

    @ApiProperty({
        example: true
    })
    @IsBoolean()
    isPublic: boolean;
}