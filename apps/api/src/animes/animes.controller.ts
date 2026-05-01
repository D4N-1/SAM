import { Body, ConflictException, Controller, Get, NotFoundException, Param, Post, Query } from "@nestjs/common";
import { AnimeService } from "./animes.service";
import { ANIME_ERRORS } from "src/common/constants/error-messages";
import { ensureExists } from "src/common/utils/assertion.util";
import { CreateAnimeDto } from "./dto/create-anime.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";

@ApiTags('animes')
@Controller('animes')
export class AnimeController {

    constructor(private animeService: AnimeService) {}


    @ApiOperation({ description: 'Lista todos los animes con o sin algun filtro' })
    @ApiResponse({ status: 200, description: 'Devuelve un array con los animes consultados' })
    @ApiResponse({ status: 404, description: 'No se halló el anime con el criterio de busqueda' })
    @ApiQuery({ name: 'romaji', required: false, description: 'El nombre del anime romanizado' })
    @ApiQuery({ name: 'english', required: false, description: 'El nombre del anime en ingles' })
    @ApiQuery({ name: 'native', required: false, description: 'El nombre original del anime en kanjis' })
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

    @ApiOperation({ description: 'Busca un anime por su id' })
    @ApiResponse({ status: 200, description: 'Devuelve el objeto del anime hallado' })
    @ApiResponse({ status: 404, description: 'No se halló ningun anime con ese id' })
    @Get(':id')
    async findOneIndex(@Param('id') id:string) {
        return ensureExists(
            await this.animeService.findOneIndex(+id),
            new NotFoundException( ANIME_ERRORS.NOT_FOUND('id', id) )
        )
    }

    @ApiOperation({ description: 'Postea un nuevo anime' })
    @ApiResponse({ status: 200, description: 'Devuelve el anime creado' })
    @ApiResponse({})
    @Post()
    async create(@Body() CreateAnimeDto: CreateAnimeDto) {


        const exists = await this.animeService.findOneIndex(CreateAnimeDto.id)

        if (Array.isArray(exists) && exists.length > 0) throw new ConflictException( ANIME_ERRORS.CONFLICT(`id`, CreateAnimeDto.id) )


        const res = ensureExists(
            await this.animeService.create(CreateAnimeDto),
            new ConflictException()
        )

        return {
            success: true,
            message: 'Anime creado',
            data: res
        }
    }



}