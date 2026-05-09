import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";


export class CreateContactDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(35)
    uid: string;

    @IsString()
    @IsOptional()
    @MaxLength(35)
    lid?: string;

    @IsString()
    @IsOptional()
    @MaxLength(25)
    name?: string;
}