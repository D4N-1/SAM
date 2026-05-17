import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
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
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
        format: 'uuid'
    })
    @Column({ type: 'uuid', unique: true })
    @Generated('uuid')
    uuid: string;

    @ApiProperty({
        description: 'El contacto ligado al usuario',
        example: ContactEntity,
        type: () => ContactEntity
    })
    @OneToOne( () => ContactEntity, (contact) => contact.user )
    @JoinColumn({ name: 'contact' })
    contact: ContactEntity;

    @ApiProperty({
        description: 'Nombre del usuario (Debe ser único)',
        example: 'Dani',
        type: String
    })
    @Column({ type: 'varchar', length: 25, nullable: true, unique: true })
    name?: string;

    @ApiProperty({
        description: 'Descripción del usuario',
        example: 'Hola, soy Dani',
        type: String
    })
    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    @ApiProperty({
        description: 'URL de la imagen de perfil',
        example: 'Dani.png',
        type: String
    })
    @Column({ name: 'image_url', type: 'varchar', length: 255, nullable: true })
    imageUrl?: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'Dani123',
        type: String
    })
    @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
    passwordHash?: string;

    @ApiProperty({
        description: 'El rol asignado al usuario',
        type: () => RoleEntity
    })
    @ManyToOne( () => RoleEntity, (role) => role.users )
    @JoinColumn({ name: 'role' })
    role: RoleEntity;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    deletedAt: Date;
}