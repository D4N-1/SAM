import { Type } from "class-transformer";
import { IsBoolean, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

class GreetingsDto {

    @IsBoolean()
    @IsOptional()
    active?: boolean = true;

    @IsString()
    @IsOptional()
    text?: string;

    @IsBoolean()
    @IsOptional()
    mode?: boolean = false;

    @IsString()
    @IsOptional()
    image?: string;

    @IsBoolean()
    @IsOptional()
    avatar?: boolean = true;

}

export class GroupSettingsDto {

    @IsBoolean()
    @IsOptional()
    active?: boolean = true;

    @IsBoolean()
    @IsOptional()
    perfil?: boolean = true;

    @IsBoolean()
    @IsOptional()
    gacha?: boolean = true;

    @IsBoolean()
    @IsOptional()
    nsfw?: boolean = false;

    @IsBoolean()
    @IsOptional()
    media?: boolean = true;

    @IsBoolean()
    @IsOptional()
    reaction?: boolean = true;

    @IsOptional()
    @ValidateNested()
    @Type( () => GreetingsDto )
    welcome?: GreetingsDto;

    @IsOptional()
    @ValidateNested()
    @Type( () => GreetingsDto )
    goodbye?: GreetingsDto;

}