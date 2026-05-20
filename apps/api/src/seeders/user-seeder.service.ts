import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { hash } from "bcrypt";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class UserSeederService implements OnModuleInit {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
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

                await this.userRepository.save({
                    ...newData,
                    contact: { uid: user.contactUid } as ContactEntity
                })
            }
        }

        console.log(`[] - Seeder de Usuarios realizado`)
    }
}