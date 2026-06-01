import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { DTO } from "src/common/constants/generic.dto";
import { BaseEntity } from "src/common/entities/base.entity";
import { BotEntity } from "src/modules/bots/entities/bot.entity";
import { CommunityEntity } from "src/modules/communities/entities/community.entity";
import { GroupEntity } from "src/modules/groups/entities/group.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('contacts')
export class ContactEntity extends BaseEntity {

    @ApiProperty({
        description: 'El identificador único del contacto (formato @s/numero telefonico)',
        example: DTO.UID,
        type: String
    })
    @Column({ type: 'varchar', length: 35, unique: true })
    uid: string;


    @ApiProperty({
        description: 'El identificador único del contacto (formato @lid/whatsapp lid)',
        example: DTO.LID,
        type: String
    })
    @Column({ type: 'varchar', length: 35, unique: true, nullable: true })
    lid?: string;


    @ApiProperty({
        description: 'Nombre del contacto',
        example: DTO.NAME + DTO.OPTIONAL,
        type: String
    })
    @Column({ type: 'varchar', length: 25, nullable: true })
    name?: string;

    ////////////////////////////

    @Exclude()
    @ApiHideProperty()
    @OneToOne( () => UserEntity, (user) => user.contact)
    user: UserEntity;


    @Exclude()
    @ApiHideProperty()
    @OneToMany( () => CommunityEntity, (community) => community.owner)
    communityOwner: CommunityEntity[];

    @Exclude()
    @ApiHideProperty()
    @OneToMany( () => CommunityEntity, (community) => community.nameOwner)
    communityNameOwner: CommunityEntity[];


    @Exclude()
    @ApiHideProperty()
    @OneToMany( () => CommunityEntity, (community) => community.descriptionOwner)
    communityDescriptionOwner: CommunityEntity[];

    
    @Exclude()
    @ApiHideProperty()
    @OneToOne( () => BotEntity, (bot) => bot.contact)
    bot: BotEntity;


    @Exclude()
    @ApiHideProperty()
    @OneToOne( () => BotEntity, (bot) => bot.ownerContact)
    botOwner: BotEntity;


    @Exclude()
    @ApiHideProperty()
    @OneToMany( () => GroupEntity, (group) => group.nameOwner)
    groupNameOwner: GroupEntity[];


    @Exclude()
    @ApiHideProperty()
    @OneToMany( () => GroupEntity, (group) => group.owner)
    groupOwner: GroupEntity[];


    @Exclude()
    @ApiHideProperty()
    @OneToMany( () => GroupEntity, (group) => group.descriptionOwner)
    groupDescriptionOwner: GroupEntity[];


}