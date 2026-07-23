import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class ParticipantDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    lid?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    admin?: string;
}

export class GroupMetadataDto {

    @ApiProperty({
        example: [ParticipantDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type( () => ParticipantDto)
    participants: ParticipantDto[] | []
}