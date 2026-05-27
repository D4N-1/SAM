import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { DTO } from "src/common/constants/generic.dto";
import { CommunityEntity } from "src/modules/communities/entities/community.entity";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('groups')
export class GroupEntity {

    @ApiHideProperty()
    @PrimaryGeneratedColumn()
    @Exclude()
    index: number;


    @ApiProperty({
        description: 'El identificador único público',
        example: DTO.UUID,
        type: String,
        format: 'uuid'
    })
    @Column({ type: 'uuid', unique: true })
    @Generated('uuid')
    uuid: string;


    @Column({ name: 'community', type: 'varchar', nullable: true })
    communityUid?: string | null;

    @ApiProperty({
        description: 'La comunidad al que pertenece',
        type: () => CommunityEntity
    })
    @ManyToOne( () => CommunityEntity, (community) => community.groups, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'community', referencedColumnName: 'uid' })
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
        example: 'SAM x Grupo',
        type: String
    })
    @Column({ type: 'varchar', length: 25 })
    name: string;


    @ApiProperty({
        description: 'Fecha del ultimo cambio al nombre del grupo',
    })
    @Column({ name: 'name_time', type: 'timestamp', nullable: true })
    nameTime?: Date | null;


    @Column({ name: 'name_owner', type: String, nullable: true })
    nameOwnerUid?: string | null;

    @ApiProperty({
        description: 'El contacto quien cambió el nombre del grupo',
        type: () => ContactEntity
    })
    @ManyToOne( () => ContactEntity, (contact) => contact.groupNameOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'name_owner', referencedColumnName: 'uid' })
    nameOwner?: ContactEntity | null;


    @ApiProperty({
        description: 'El tamaño de miembros que tiene el grupo',
        example: DTO.SIZE
    })
    @Column()
    size: number;


    @ApiProperty({
        description: 'Fecha de la creacion del grupo en UNIX'
    })
    @Column({ type: 'timestamp' })
    creation: Date;


    @Column({ name: 'owner', type: String, nullable: true })
    ownerUid?: string | null;

    @ApiProperty({
        description: 'El contacto del creador del grupo',
        type: () => ContactEntity
    })
    @ManyToOne( () => ContactEntity, (contact) => contact.groupOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'owner', referencedColumnName: 'uid' })
    owner?: ContactEntity | null;


    @ApiProperty({
        description: 'La descripción del grupo',
        example: 'Bienvenidos al grupo de SAM',
        type: String
    })
    @Column({ type: 'varchar', length: 1024, nullable: true })
    description?: string | null;


    @Column({ name: 'description_owner', type: String, nullable: true })
    descriptionOwnerUid?: string | null;


    @ApiProperty({
        description: 'El contacto de quien cambió la descripción',
        type: () => ContactEntity
    })
    @ManyToOne( () => ContactEntity, (contact) => contact.groupDescriptionOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'description_owner', referencedColumnName: 'uid' })
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

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    deletedAt: Date;


}
