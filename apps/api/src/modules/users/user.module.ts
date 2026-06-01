import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ContactModule } from "../contacts/contact.module";
import { RoleModule } from "../roles/role.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        ContactModule,
        RoleModule
    ],
    controllers: [ UserController ],
    providers: [ UserService ],
    exports: [ UserService ]
})
export class UserModule {}