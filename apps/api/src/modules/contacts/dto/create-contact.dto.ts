import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";


export class CreateContactDto {

    @ApiProperty({
        example: DTO.UID
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(35)
    uid: string;

    @ApiProperty({
        example: DTO.LID
    })
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
    name?: string;
}