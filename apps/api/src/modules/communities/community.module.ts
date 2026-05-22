import { Module } from "@nestjs/common";
import { CommunityController } from "./community.controller";
import { CommunityService } from "./community.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommunityEntity } from "./entities/community.entity";
import { ContactModule } from "../contacts/contact.module";
import { CommunitySeederService } from "src/seeders/community-seeder.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([CommunityEntity]),
        ContactModule
    ],
    controllers: [CommunityController],
    providers: [CommunityService, CommunitySeederService],
    exports: [CommunityService]
})
export class CommunityModule {}