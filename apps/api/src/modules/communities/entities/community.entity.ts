import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { DTO } from "src/common/constants/generic.dto";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { GroupEntity } from "src/modules/groups/entities/group.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('communities')
export class CommunityEntity {

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

    @ApiProperty({
        description: 'El identificador único de la comunidad',
        example: DTO.GROUP_UID,
        type: String
    })
    @Column({ type: 'varchar', length: 35, unique: true })
    uid: string;

    @ApiHideProperty()
    @OneToOne( () => ContactEntity, (contact) => contact.community, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'owner_contact' })
    ownerContact?: ContactEntity | null;

    @ApiProperty({
        description: 'El nombre de la comunidad',
        example: 'SAM x Comunidad',
        type: String
    })
    @Column({ type: 'varchar', length: 255, nullable: true })
    name?: string;

    @ApiProperty({
        description: 'La descripción de la comunidad',
        example: 'Bienvenidos a la comunidad de SAM',
        type: String
    })
    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    @ApiProperty({
        description: 'La URL de invitación a la comunidad',
        example: 'https://ws.invite/320987654321',
        type: String
    })
    @Column({ type: 'varchar', length: 255, nullable: true })
    link?: string;

    @ApiProperty({
        description: 'Indica si la comunidad esta abierta a nuevos miembros',
        example: true,
        type: Boolean
    })
    @Column({ type: Boolean, name: 'is_public', nullable: true })
    isPublic: boolean;

    @ApiHideProperty()
    @OneToMany( () => GroupEntity, (group) => group.community)
    groups: GroupEntity[];

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    deletedAt: Date;
}