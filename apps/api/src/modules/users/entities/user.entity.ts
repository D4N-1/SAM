import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { DTO } from "src/common/constants/generic.dto";
import { enumRole } from "src/common/enums/role.enum";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { RoleEntity } from "src/modules/roles/entities/role.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {

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

    @Column({ name: 'contact', type: 'varchar', nullable: true })
    contactUid: string | null;

    @ApiHideProperty()
    @OneToOne( () => ContactEntity, (contact) => contact.user, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    } )
    @JoinColumn({ name: 'contact', referencedColumnName: 'uid' })
    contact: ContactEntity;

    @ApiProperty({
        description: 'Nombre del usuario (Debe ser único)',
        example: DTO.OPCIONAL_NAME,
        type: String
    })
    @Column({ type: 'varchar', length: 25, nullable: true, unique: true })
    name?: string;

    @ApiProperty({
        description: 'Descripción del usuario',
        example: DTO.DESCRIPTION,
        type: String
    })
    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    @ApiProperty({
        description: 'URL de la imagen de perfil',
        example: DTO.PHOTO,
        type: String
    })
    @Column({ name: 'image_url', type: 'varchar', length: 255, nullable: true })
    imageUrl?: string;

    @ApiProperty({
        description: 'Email único del usuario',
        example: DTO.EMAIL,
        type: String
    })
    @Column({
        type: 'varchar',
        length: 50,
        nullable: true
    })
    email?: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: DTO.PASSWORD,
        type: String
    })
    @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
    passwordHash?: string;

    @Column({ name: 'role', type: 'enum', enum: enumRole, nullable: true })
    roleName: enumRole | null;

    @ApiProperty({
        description: 'El rol asignado al usuario',
        type: () => RoleEntity,
        example: () => RoleEntity
    })
    @ManyToOne( () => RoleEntity, (role) => role.users )
    @JoinColumn({ name: 'role', referencedColumnName: 'name' })
    role: RoleEntity;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    deletedAt: Date;
}