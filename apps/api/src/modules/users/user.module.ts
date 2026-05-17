import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ContactModule } from "../contacts/contact.module";
import { RoleModule } from "../roles/roles.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        ContactModule,
        RoleModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}