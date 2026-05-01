import { Injectable } from "@nestjs/common"
import { AnimesEntity } from "./entities/anime.entity"
import { Like, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { CreateAnimeDto } from "./dto/create-anime.dto"
import { GendersEntity } from "src/genders/entities/gender.entity"

@Injectable()
export class AnimeService {

    constructor(
        @InjectRepository(AnimesEntity)
        private AnimeRepository: Repository<AnimesEntity>,
    ) {}

    findAll(): Promise<AnimesEntity[]> {
        return this.AnimeRepository.find()
    }

    findOneIndex(id:number): Promise<AnimesEntity[]|null> {

        console.log(`EL ID A BUSCAR ES ${id}`)
        return this.AnimeRepository.find({
            where: { id },
            relations: {
                genders: true
            }
        })
    }

    findLikeRomaji(romaji:string): Promise<AnimesEntity|null> {
        return this.AnimeRepository.findOneBy({ romaji: Like(`%${romaji}%`) })
    }

    findLikeEnglish(english:string): Promise<AnimesEntity|null> {
        return this.AnimeRepository.findOneBy({ english: Like(`%${english}%`) })
    }

    findLikeNative(native:string): Promise<AnimesEntity|null> {
        return this.AnimeRepository.findOneBy({ native: Like(`%${native}%`)})
    }

    async create(anime: CreateAnimeDto): Promise<AnimesEntity|null> {
        const { gendersIds, ...animeData } = anime

        console.log(animeData)

        const newAnime = this.AnimeRepository.create(animeData)

        if (gendersIds && gendersIds.length > 0) newAnime.genders = gendersIds.map(id => ({ index: id } as GendersEntity))

        return await this.AnimeRepository.save(newAnime)
    }
}