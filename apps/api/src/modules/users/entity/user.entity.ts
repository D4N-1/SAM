import { ApiHideProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { enumRole } from "src/common/enums/role.enum";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { RoleEntity } from "src/modules/roles/entities/role.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Generated, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, JoinColumn, Entity } from "typeorm";

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    @Exclude()
    @ApiHideProperty()
    index: number;

    @Column({
        type: 'uuid',
        unique: true
    })
    @Generated('uuid')
    uuid: string;

    @OneToOne( () => ContactEntity, (contact) => contact.user )
    @JoinColumn()
    contact: ContactEntity;

    @Column({
        type: 'varchar',
        length: 25,
        nullable: true
    })
    name?: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    description?: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    imageUrl?: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    passwordHash: string;

    @OneToOne( () => RoleEntity, (role) => role.user )
    @Column()
    role: RoleEntity;

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