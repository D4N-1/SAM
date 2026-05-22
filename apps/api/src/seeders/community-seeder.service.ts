import { OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommunityEntity } from "src/modules/communities/entities/community.entity";
import { Repository } from "typeorm";

export class CommunitySeederService implements OnModuleInit {

    constructor(
        @InjectRepository(CommunityEntity)
        private readonly communityRepository: Repository<CommunityEntity>
    ) {}

    async onModuleInit() {
        await this.seedCommunities()
    }

    async seedCommunities() {
        const communitiesToCreate = [
            {
                uid: '1',
                name: 'one'
            },
            {
                uid: '2',
                name: 'two'
            }
        ]

        for (const community of communitiesToCreate) {
            const exists = await this.communityRepository.findOneBy({ uid: community.uid })
            if (!exists) {
                const newCommunity = this.communityRepository.create(community)
                await this.communityRepository.save(newCommunity)
            }
        }

        console.log('[] - Seeder de Comunidades realizado')
    }
}