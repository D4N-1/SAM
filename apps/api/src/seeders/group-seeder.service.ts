import { OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommunityService } from "src/modules/communities/community.service";
import { GroupEntity } from "src/modules/groups/entities/group.entity";
import { Repository } from "typeorm";



export class GroupSeederService implements OnModuleInit {

    constructor(
        @InjectRepository(GroupEntity)
        private readonly groupRepository: Repository<GroupEntity>,

        private readonly communityRepository: CommunityService
    ) {}

    async onModuleInit() {
        await this.seedGroups()
    }


    async seedGroups() {

        const groupsToCreate = [
            {
                communityUid: '1',
                uid: '1',
                name: 'one'
            },
            {
                communityUid: '2',
                uid: '2',
                name: 'two'
            }
        ]

        for (const group of groupsToCreate) {

            const exists = await this.groupRepository.findOneBy({ uid: group.uid })

            if (!exists) {
                const newData: Partial<GroupEntity> = {}

                newData.community = await this.communityRepository.findOneBy.uid(group.communityUid)

                await this.groupRepository.save({
                    ...newData,
                    uid: group.uid,
                    name: group.name
                })
            }
        }

        console.log(`[] - Seeder de Grupos realizado`)
    }
}