import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class CreateBotDto {

    @ApiProperty({
        example: '320987654321'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(35)
    contactUid: string;

    @ApiProperty({
        example: 'S4MWWBOT'
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 8)
    code: string;

    @ApiProperty({
        example: '320987654321 (opcional)'
    })
    @IsString()
    @IsOptional()
    @MaxLength(35)
    ownerContactUid?: string;

}
