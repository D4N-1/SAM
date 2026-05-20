import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactEntity } from "./entities/contact.entity";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";
import { ContactSeederService } from "src/seeders/contact-seeder.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([ContactEntity])
    ],
    controllers: [ContactController],
    providers: [ContactService, ContactSeederService],
    exports: [ContactService]
})
export class ContactModule {}