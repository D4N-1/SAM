import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ParticipantDto {

    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    lid?: string|undefined;

    @IsString()
    @IsOptional()
    phoneNumber?: string|undefined;

    @IsString()
    @IsOptional()
    admin?: 'admin'|'superadmin'|null;

    @IsString()
    @IsOptional()
    username?: string|undefined;
}
