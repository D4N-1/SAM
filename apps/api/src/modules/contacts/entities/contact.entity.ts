import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { DTO } from "src/common/constants/generic.dto";
import { BotEntity } from "src/modules/bots/entities/bot.entity";
import { CommunityEntity } from "src/modules/communities/entities/community.entity";
import { GroupEntity } from "src/modules/groups/entities/group.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('contacts')
export class ContactEntity {

    @ApiHideProperty()
    @PrimaryGeneratedColumn()
    @Exclude()
    index: number;


    @ApiProperty({
        description: 'El identificador unico público',
        example: DTO.UUID,
        type: String,
        format: 'uuid'
    })
    @Column({ type: 'uuid', unique: true })
    @Generated('uuid')
    uuid: string;


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
        example: DTO.OPCIONAL_NAME,
        type: String
    })
    @Column({ type: 'varchar', length: 25, nullable: true })
    name?: string;


    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;


    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;


    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    deletedAt: Date;


    @ApiHideProperty()
    @OneToOne( () => UserEntity, (user) => user.contact)
    user: UserEntity;


    @ApiHideProperty()
    @OneToMany( () => CommunityEntity, (community) => community.owner)
    communityOwner: CommunityEntity[];

    @ApiHideProperty()
    @OneToMany( () => CommunityEntity, (community) => community.nameOwner)
    communityNameOwner: CommunityEntity[];


    @ApiHideProperty()
    @OneToMany( () => CommunityEntity, (community) => community.descriptionOwner)
    communityDescriptionOwner: CommunityEntity[];

    
    @ApiHideProperty()
    @OneToOne( () => BotEntity, (bot) => bot.contact)
    bot: BotEntity;


    @ApiHideProperty()
    @OneToOne( () => BotEntity, (bot) => bot.ownerContact)
    botOwner: BotEntity;


    @ApiHideProperty()
    @OneToMany( () => GroupEntity, (group) => group.nameOwner)
    groupNameOwner: GroupEntity[];


    @ApiHideProperty()
    @OneToMany( () => GroupEntity, (group) => group.owner)
    groupOwner: GroupEntity[];


    @ApiHideProperty()
    @OneToMany( () => GroupEntity, (group) => group.descriptionOwner)
    groupDescriptionOwner: GroupEntity[];


}