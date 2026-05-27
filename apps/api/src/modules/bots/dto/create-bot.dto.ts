import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length, MaxLength } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";

export class CreateBotDto {

    @ApiProperty({
        example: DTO.UID
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(35)
    contactUid: string;

    @ApiProperty({
        example: DTO.CODE
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 8)
    code: string;

    @ApiProperty({
        example: 'BOT | BEEBOT'
    })
    @IsString()
    @IsOptional()
    role: string;

    @ApiProperty({
        example: DTO.OPCIONAL_UID
    })
    @IsString()
    @IsOptional()
    @MaxLength(35)
    ownerContactUid?: string;

}
