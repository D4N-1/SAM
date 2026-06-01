import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { DTO } from "src/common/constants/generic.dto";
import { BaseEntity } from "src/common/entities/base.entity";
import { BotEntity } from "src/modules/bots/entities/bot.entity";
import { CommunityEntity } from "src/modules/communities/entities/community.entity";
import { GroupEntity } from "src/modules/groups/entities/group.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { RealmCommandEntity } from "./uni-realm-command.entity";


export const RealmRelations = [ 'bot' ]

@Entity('realms')
export class RealmEntity extends BaseEntity {

    @ApiProperty({
        description: 'El nombre único del reino',
        example: DTO.REALM_NAME
    })
    @Column({ unique: true, length: 35 })
    name: string;


    @ApiHideProperty()
    @OneToOne( () => BotEntity, (bot) => bot.realm )
    @JoinColumn({ name: 'bot' })
    bot: BotEntity;


    ///////////////////////////////////

    @ApiHideProperty()
    @OneToMany( () => GroupEntity, (group) => group.realm)
    groups: GroupEntity[];

    @ApiHideProperty()
    @OneToMany( () => CommunityEntity, (community) => community.realm)
    communities: CommunityEntity[];

    @ApiHideProperty()
    @OneToMany( () => RealmCommandEntity, (realmCommand) => realmCommand.realm)
    commands: RealmCommandEntity[];

}