import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { DTO } from "src/common/constants/generic.dto";
import { BaseEntity } from "src/common/entities/base.entity";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { GroupEntity } from "src/modules/groups/entities/group.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export const CommunityRelations = [ 'nameOwner', 'owner', 'descriptionOwner' ]


@Entity('communities')
export class CommunityEntity extends BaseEntity {

    @ApiProperty({
        description: 'El identificador único de la comunidad',
        example: DTO.GROUP_UID,
        type: String
    })
    @Column({ type: 'varchar', length: 35, unique: true })
    uid: string;


    @ApiProperty({
        description: 'El nombre de la comunidad',
        example: DTO.COMMUNITY_NAME,
        type: String
    })
    @Column({ type: 'varchar', length: 256 })
    name: string;


    @ApiProperty({
        description: 'Fecha del ultimo cambio al nombre de la comunidad',
    })
    @Column({ name: 'name_time', type: 'timestamp', nullable: true })
    nameTime?: Date | null;


    @Column({ name: 'name_owner', type: String, nullable: true })
    nameOwnerUid?: string | null;

    @ApiHideProperty()
    @ManyToOne( () => ContactEntity, (contact) => contact.communityNameOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'name_owner', referencedColumnName: 'uid' })
    nameOwner?: ContactEntity | null;


    @ApiProperty({
        description: 'El tamaño de miembros que tiene la comunidad',
        example: DTO.SIZE
    })
    @Column()
    size: number;


    @ApiProperty({
        description: 'Fecha de la creacion de la comunidad'
    })
    @Column({ type: 'timestamp' })
    creation: Date;


    @Column({ name: 'owner', type: String, nullable: true })
    ownerUid?: string | null;

    @ApiHideProperty()
    @ManyToOne( () => ContactEntity, (contact) => contact.communityOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'owner', referencedColumnName: 'uid' })
    owner?: ContactEntity | null;


    @ApiProperty({
        description: 'La descripción de la comunidad',
        example: 'Bienvenidos a la comunidad de SAM',
        type: String
    })
    @Column({ type: 'varchar', length: 2048, nullable: true })
    description?: string | null;


    @Column({ name: 'description_owner', type: String, nullable: true })
    descriptionOwnerUid?: string | null;

    @ApiHideProperty()
    @ManyToOne( () => ContactEntity, (contact) => contact.communityDescriptionOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'description_owner', referencedColumnName: 'uid' })
    descriptionOwner?: ContactEntity | null;


    @ApiProperty({
        description: 'El link de invitación a la comunidad',
        example: DTO.LINK
    })
    @Column({ name: 'invitation_link', nullable: true, type: 'varchar', length: 256 })
    invitationLink?: string;


    @ApiProperty({
        description: 'La comunidad acepta nuevos miembros por el link',
        example: DTO.BOOLEAN
    })
    @Column({ name: 'public_link', nullable: true, default: false })
    publicLink?: boolean;

    ///////////////////////////////

    @ApiHideProperty()
    @OneToMany( () => GroupEntity, (group) => group.community)
    groups: GroupEntity[];

}
