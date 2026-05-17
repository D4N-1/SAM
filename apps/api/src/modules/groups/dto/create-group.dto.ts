import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateGroupDto {

    @ApiProperty({
        example: '310987654321@g'
    })
    @IsString()
    @IsNotEmpty()
    communityUid: string;

    @ApiProperty({
        example: '320987654321@g'
    })
    @IsString()
    @IsNotEmpty()
    uid: string;

    @ApiProperty({
        example: 'SAM x Grupo',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'Bienvenidos al grupo de SAM'
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;
    
}
