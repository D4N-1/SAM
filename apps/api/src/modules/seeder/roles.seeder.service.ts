import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "../roles/entities/role.entity";
import { enumRole } from "src/common/enums/role.enum";


@Injectable()
export class RolesSeederService implements OnApplicationBootstrap {
    
    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>
    ) {}

    async onApplicationBootstrap() {
        await this.seedRoles()
    }

    async seedRoles() {
        const rolesToCreate = Object.values(enumRole);

        for (const role of rolesToCreate) {
            await this.roleRepository.upsert(
                { name: role },
                [ 'name' ]
            )
        }

        console.log(`Seeder de Roles realizado`)
    }
}