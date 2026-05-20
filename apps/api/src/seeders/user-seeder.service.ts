import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { hash } from "bcrypt";
import { enumRole } from "src/common/enums/role.enum";
import { ContactService } from "src/modules/contacts/contact.service";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { RoleService } from "src/modules/roles/role.service";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class UserSeederService implements OnModuleInit {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        private readonly contactRepository: ContactService,
        private readonly roleRepository: RoleService
    ) {}

    async onModuleInit() {
        await this.seedUser()
    }

    async seedUser () {

        const usersToCreate: CreateUserDto[] = [
            {
                contactUid: '1',
                name: 'one',
                password: 'one'
            },
            {
                contactUid: '2',
                name: 'two',
                password: 'two'
            },
            {
                contactUid: '3',
                name: 'three',
                password: 'three'
            }
        ]

        for (const user of usersToCreate) {

            const exist = await this.userRepository.findOne({
                where: { contact: { uid: user.contactUid } }
            })

            if (!exist) {
                const newData: Partial<UserEntity> = { name: user.name }

                newData.passwordHash = await hash(user.password, 10)

                const contact = await this.contactRepository.findOneBy.uid(user.contactUid)
                const role = await this.roleRepository.findOneBy.name(user?.roleName || enumRole.MODERATOR)
                await this.userRepository.save({
                    ...newData,
                    contact,
                    role
                })
            }
        }

        console.log(`[] - Seeder de Usuarios realizado`)
    }
}