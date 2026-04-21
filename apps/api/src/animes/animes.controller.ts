import { Body, Controller, Get, NotFoundException, Param, Post, Query } from "@nestjs/common";
import { AnimeService } from "./animes.service";
import { ANIME_ERRORS } from "src/common/constants/error-messages";
import { ensureExists } from "src/common/utils/assertion.util";
import { Not } from "typeorm";
import { CreateAnimeDto } from "./dto/create-anime.dto";


@Controller('animes')
export class AnimeController {

    constructor(private animeService: AnimeService) {}


    @Get()
    async findAll(
        @Query('romaji') romaji?: string,
        @Query('english') english?: string,
        @Query('native') native?: string
    ) {

        if (native) {
            return ensureExists(
                await this.animeService.findLikeNative(native),
                new NotFoundException( ANIME_ERRORS.NOT_FOUND('native', native))
            )

        } else if (romaji) {
            return ensureExists(
                await this.animeService.findLikeRomaji(romaji),
                new NotFoundException( ANIME_ERRORS.NOT_FOUND('romaji', romaji) )
            )

        } else if (english) {
            return ensureExists(
                await this.animeService.findLikeEnglish(english),
                new NotFoundException( ANIME_ERRORS.NOT_FOUND('english', english) )
            )

        } else return await this.animeService.findAll()

    }

    @Get(':id')
    async findOneIndex(@Param('id') id:string) {
        return ensureExists(
            await this.animeService.findOneIndex(+id),
            new NotFoundException( ANIME_ERRORS.NOT_FOUND('id', id) )
        )
    }

    @Post()
    async create(@Body() CreateAnimeDto: CreateAnimeDto) {
        const created = await this.animeService.create(CreateAnimeDto)

        return {
            success: true,
            message: 'Anime creado',
            data: created
        }
    }



}