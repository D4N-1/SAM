import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactEntity } from "./entities/contact.entity";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";
import { ContactSeederService } from "src/seeders/contact-seeder.service";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "../auth/guards/role.guard";
import { JwtGuard } from "../auth/guards/jwt.guard";


@Module({
    imports: [
        TypeOrmModule.forFeature([ContactEntity])
    ],
    controllers: [ContactController],
    providers: [
        ContactService,

        {
            provide: APP_GUARD,
            useClass: JwtGuard
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    exports: [ContactService]
})
export class ContactModule {}