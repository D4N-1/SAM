import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class ParticipantDto {
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
