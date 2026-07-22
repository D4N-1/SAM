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

    @IsNumber()
    @IsOptional()
    participantsCount?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type( () => ParticipantDto)
    participants: ParticipantDto[]
}