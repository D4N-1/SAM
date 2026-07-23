import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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
    admin?: 'admin'|'superadmin'|null;
}
