import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { CommunityEntity } from "src/modules/communities/entities/community.entity";
import { UserEntity } from "src/modules/users/entity/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('contacts')
export class ContactEntity {

    @ApiHideProperty()
    @PrimaryGeneratedColumn()
    @Exclude()
    index: number;

    @ApiProperty({
        description: 'El identificador unico público',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
        format: 'uuid'
    })
    @Column({ type: 'uuid', unique: true })
    @Generated('uuid')
    uuid: string;

    @ApiProperty({
        description: 'El identificador único del contacto (formato @s/numero telefonico)',
        example: '3107654321@s.whatsapp.net',
        type: String
    })
    @Column({ type: 'varchar', length: 35, unique: true })
    uid: string;

    @ApiProperty({
        description: 'El identificador único del contacto (formato @lid/whatsapp lid)',
        example: '3107654321@lid',
        type: String
    })
    @Column({ type: 'varchar', length: 35, unique: true, nullable: true })
    lid?: string;

    @ApiProperty({
        description: 'Nombre del contacto',
        example: 'Dani',
        type: String
    })
    @Column({
        type: 'varchar',
        length: 25,
        nullable: true
    })
    name?: string;

    @ApiHideProperty()
    @OneToOne( () => UserEntity, (user) => user.contact)
    user: UserEntity;

    @ApiHideProperty()
    @OneToOne( () => CommunityEntity, (community) => community.contactOwner)
    community?: CommunityEntity | null;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at'

    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at'

    })
    deletedAt: Date;

}