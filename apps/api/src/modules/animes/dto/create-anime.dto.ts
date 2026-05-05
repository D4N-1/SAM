import { 
  IsBoolean, IsDate, IsEnum, IsInt, IsOptional, 
  IsString, MaxLength, Min, Max, 
  IsArray
} from "class-validator";
import { Type } from "class-transformer";
import { AnimeFormat } from "src/common/enums/anime-format.enum";
import { AnimeSeason } from "src/common/enums/anime-season.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAnimeDto {

    @ApiProperty({
      example: 1,
      description: 'El id del anime'
    })
    @IsInt()
    id: number;

    @ApiProperty({
      required: false,
      example: `青春ブタ野郎シリーズ`,
      description: 'El nombre original del anime'
    })
    @IsString()
    @IsOptional()
    @MaxLength(150)
    native?: string;

    @ApiProperty({
      example: 'Seishun Buta Yarou',
      description: 'El nombre romanizado del anime'
    })
    @IsString()
    @MaxLength(150)
    romaji: string;

    @ApiProperty({
      required: false,
      example: 'Rascal Does not Dream',
      description: 'El nombre en ingles del anime'
    })
    @IsString()
    @IsOptional()
    @MaxLength(150)
    english?: string;

    @ApiProperty({
      required: false,
      example: 'TV',
      description: 'El formato de presentación'
    })
    @IsEnum(AnimeFormat)
    @IsOptional()
    format?: AnimeFormat;

    @ApiProperty({
      required: false,
      example: 'The rare and inexplicable Puberty Syndrome is thought of as a myth ' +
        'It is a rare disease which only affects teenagers...',
      description: 'La descripcion del anime'
    })
    @IsString()
    @IsOptional()
    desc?: string;

    @ApiProperty({
      required: false,
      example: 'True/False',
      description: 'Si es exclusivamente para mayores de edad'
    })
    @IsBoolean()
    @IsOptional()
    is_adult?: boolean = false;

    @ApiProperty({
      required: false,
      example: 0,
      description: 'La puntuacion del anime'
    })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(100)
    score?: number = 0;

    @IsInt()
    @IsOptional()
    likes?: number = 0;

    @ApiProperty({
      required: false,
      example: [ 1, 2, 3, 4 ],
      description: 'Los generos a los que pertenece'
    })
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