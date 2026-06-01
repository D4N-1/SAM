import { Module } from "@nestjs/common";
import { CommunityController } from "./community.controller";
import { CommunityService } from "./community.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommunityEntity } from "./entities/community.entity";
import { ContactModule } from "../contacts/contact.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { RealmModule } from "../realms/realm.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([CommunityEntity]),
        ContactModule, RealmModule
    ],
    controllers: [CommunityController],
    providers: [
        CommunityService,
        {
            provide: APP_GUARD,
            useClass: JwtGuard
        }
    ],
    exports: [CommunityService]
})
export class CommunityModule {}