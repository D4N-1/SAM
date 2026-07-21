import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { DTO } from "src/common/constants/generic.dto";
import { BaseEntity } from "src/common/entities/base.entity";
import { enumEphemeralDuration } from "src/common/enums/ephemeral-duration.enum";
import { CommunityEntity } from "src/modules/communities/entities/community.entity";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { RealmEntity } from "src/modules/realms/entities/realm.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

export const GroupRelations = [ 'community', 'nameOwner', 'descriptionOwner', 'owner' ];
export const GroupFullRelations = {
    community: {
        realm: true
    },
    nameOwner: true,
    descriptionOwner: true,
    owner: true
}

@Entity('groups')
export class GroupEntity extends BaseEntity {

    @ApiHideProperty()
    @ManyToOne( () => CommunityEntity, (community) => community.groups, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'community' })
    community?: CommunityEntity | null;


    @ApiProperty({
        description: 'El identificador único del grupo',
        example: DTO.GROUP_UID,
        type: String
    })
    @Column({ type: 'varchar', length: 35, unique: true })
    uid: string;


    @ApiProperty({
        description: 'El nombre del grupo',
        example: DTO.GROUP_NAME,
        type: String
    })
    @Column({ type: 'varchar', length: 256 })
    name: string;


    @ApiProperty({
        description: 'Fecha del ultimo cambio al nombre del grupo',
    })
    @Column({ name: 'name_time', type: 'timestamp', nullable: true })
    nameTime?: Date | null;


    @ApiHideProperty()
    @ManyToOne( () => ContactEntity, (contact) => contact.groupNameOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'name_owner' })
    nameOwner?: ContactEntity | null;


    @ApiProperty({
        description: 'El tamaño de miembros que tiene el grupo',
        example: DTO.SIZE
    })
    @Column()
    size: number;


    @ApiProperty({
        description: 'Fecha de la creacion del grupo'
    })
    @Column({ type: 'timestamp' })
    creation: Date;

    @ApiHideProperty()
    @ManyToOne( () => ContactEntity, (contact) => contact.groupOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'owner' })
    owner?: ContactEntity | null;


    @ApiProperty({
        description: 'La descripción del grupo',
        example: 'Bienvenidos al grupo de SAM',
        type: String
    })
    @Column({ type: 'varchar', length: 2048, nullable: true })
    description?: string | null;


    @ApiHideProperty()
    @ManyToOne( () => ContactEntity, (contact) => contact.groupDescriptionOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'description_owner' })
    descriptionOwner?: ContactEntity | null;


    @ApiProperty({
        description: 'El grupo puede ser editado por cualquier participante',
        example: DTO.BOOLEAN
    })
    @Column({ nullable: true, default: false })
    restrict: boolean


    @ApiProperty({
        description: 'Solo los admins pueden enviar mensajes',
        example: DTO.BOOLEAN
    })
    @Column({ nullable: true, default: false })
    announce: boolean;


    @ApiProperty({
        description: 'Si los administradores deben aprobar el ingreso',
        example: DTO.BOOLEAN
    })
    @Column({ nullable: true, default: false })
    joinApprovalMode: boolean;


    @ApiProperty({
        description: 'Si los miembros pueden añadir participantes al grupo',
        example: DTO.BOOLEAN
    })
    @Column({ nullable: true, default: true })
    memberAddMode: boolean;


    @ApiProperty({
        description: 'La duración de los mensajes ',
        example: enumEphemeralDuration.DAY
    })
    @Column({ nullable: true, default: 0 })
    ephemeralDuration: enumEphemeralDuration;


    @ApiHideProperty()
    @ManyToOne( () => RealmEntity, (realm) => realm.groups, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        nullable: true
    })
    @JoinColumn({ name: 'realm', referencedColumnName: 'name' })
    realm?: RealmEntity | null;



    ////////////////////////


}
