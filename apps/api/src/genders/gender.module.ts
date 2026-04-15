import { Module } from "@nestjs/common";
import { GenderService } from "./gender.service";
import { GenderController } from "./gender.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { gender } from "./entities/gender.entity";


@Module({
    imports: [TypeOrmModule.forFeature([gender])],
    controllers: [GenderController],
    providers: [GenderService]
})
export class genderModule {}