import { 
  IsBoolean, IsDate, IsEnum, IsInt, IsOptional, 
  IsString, MaxLength, Min, Max, 
  IsArray
} from "class-validator";
import { Type } from "class-transformer";
import { AnimeFormat } from "src/common/enums/anime-format.enum";
import { AnimeSeason } from "src/common/enums/anime-season.enum";

export class CreateAnimeDto {

    @IsInt()
    id: number;

    @IsString()
    @IsOptional()
    @MaxLength(150)
    native?: string;

    @IsString()
    @MaxLength(150)
    romaji: string;

    @IsString()
    @IsOptional()
    @MaxLength(150)
    english?: string;

    @IsEnum(AnimeFormat)
    format: AnimeFormat;

    @IsString()
    @IsOptional()
    desc?: string;

    @IsBoolean()
    @IsOptional()
    is_adult: boolean = false;

    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(100)
    score: number = 0;

    @IsInt()
    @IsOptional()
    likes: number = 0;

    @IsArray()
    @IsOptional()
    gendersIds?: number[];

    @IsInt()
    @IsOptional()
    @Min(1)
    episodes?: number;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    date_start?: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    date_end?: Date;

    @IsEnum(AnimeSeason)
    season: AnimeSeason;

    @IsInt()
    @Min(1901)
    @Max(2155)
    year: number;
}