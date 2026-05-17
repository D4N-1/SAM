import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { CommunityEntity } from "src/modules/communities/entities/community.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('groups')
export class GroupEntity {

    @ApiHideProperty()
    @PrimaryGeneratedColumn()
    @Exclude()
    index: number;

    @ApiProperty({
        description: 'El identificador único público',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
        format: 'uuid'
    })
    @Column({ type: 'uuid', unique: true })
    @Generated('uuid')
    uuid: string;

    @ManyToOne( () => CommunityEntity, (community) => community.groups)
    @JoinColumn({ name: 'community' })
    community: CommunityEntity;

    @ApiProperty({
        description: 'El identificador único del grupo',
        example: '320987654321@g',
        type: String
    })
    @Column({ type: 'varchar', length: 35, unique: true })
    uid: string;

    @ApiProperty({
        description: 'El nombre del grupo',
        example: 'SAM x Grupo',
        type: String
    })
    @Column({ type: 'varchar', length: 255, nullable: true })
    name?: string;

    @ApiProperty({
        description: 'La descripción del grupo',
        example: 'Bienvenidos al grupo de SAM',
        type: String
    })
    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    deletedAt: Date;


}
