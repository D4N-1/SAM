import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Max, MaxLength } from "class-validator";

export class CreateBotDto {

    @ApiProperty({
        example: '320987654321'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(35)
    contactUid: string;

    @ApiProperty({
        example: '320987654321'
    })
    @IsString()
    @IsOptional()
    @MaxLength(35)
    ownerContactUid?: string;

    @ApiProperty({
        example: 'S4MWWBOT'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(6)
    token: string;
}
