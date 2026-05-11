import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ContactModule } from "../contacts/contact.module";
import { RolesModule } from "../roles/roles.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        ContactModule,
        RolesModule
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}