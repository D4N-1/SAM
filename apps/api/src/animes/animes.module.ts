import { Module } from "@nestjs/common";
import { AnimeController } from "./animes.controller";
import { AnimeService } from "./animes.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnimesEntity } from "./entities/anime.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([AnimesEntity])
    ],
    controllers: [AnimeController],
    providers: [AnimeService]
})
export class AnimeModule {}