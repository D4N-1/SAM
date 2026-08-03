import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";


export class CreateContactDto {

    @ApiProperty({
        example: DTO.UID
    })
    @Transform( ({ value }) => typeof value === 'string' ? value.split('@')[0] : value)
    @IsString()
    @IsOptional()
    @MaxLength(35)
    uid?: string;

    @ApiProperty({
        example: DTO.LID
    })
    @Transform( ({ value }) => typeof value === 'string' ? value.split('@')[0] : value)
    @IsString()
    @IsOptional()
    @MaxLength(35)
    lid?: string;
     
    @ApiProperty({
        example: DTO.NAME + DTO.OPTIONAL
    })
    @IsString()
    @IsOptional()
    @MaxLength(25)
    username?: string;

    @ApiProperty({
        example: DTO.NAME + DTO.OPTIONAL
    })
    @IsString()
    @IsOptional()
    @MaxLength(25)
    name?: string;
}