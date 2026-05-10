import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";


export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    contactUid: string;

    @IsOptional()
    @IsString()
    @Length(25)
    name?: string;

    @IsOptional()
    @IsString()
    @Length(255)
    description?: string;

    @IsOptional()
    @IsString()
    @Length(255)
    imageUrl: string;

    @IsString()
    passwordHash: string;

    @IsString()
    role: string;
}