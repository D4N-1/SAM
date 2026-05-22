import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "../modules/roles/entities/role.entity";
import { enumRole } from "../common/enums/role.enum";


@Injectable()
export class RoleSeederService implements OnModuleInit {
    
    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>
    ) {}

    async onModuleInit() {
        await this.seedRoles()
    }

    async seedRoles() {
        const rolesToCreate = Object.values(enumRole);

        for (const role of rolesToCreate) {
            const exist = await this.roleRepository.findOneBy({ name: role })

            if (!exist) {
                const newRole = this.roleRepository.create({ name: role })
                await this.roleRepository.save(newRole)
            }
        }

        console.log(`[] - Seeder de Roles realizado`)
    }
}