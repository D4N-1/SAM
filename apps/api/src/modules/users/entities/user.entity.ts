import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { DTO } from "src/common/constants/generic.dto";
import { BaseEntity } from "src/common/entities/base.entity";
import { enumRole } from "src/common/enums/role.enum";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { RoleEntity } from "src/modules/roles/entities/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

export const UserRelations = [ 'contact', 'role' ]
@Entity('users')
export class UserEntity extends BaseEntity {

    @ApiHideProperty()
    @OneToOne( () => ContactEntity, (contact) => contact.user, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    } )
    @JoinColumn({ name: 'contact' })
    contact: ContactEntity;

    @ApiProperty({
        description: 'Nombre del usuario (Debe ser único)',
        example: DTO.NAME + DTO.OPTIONAL,
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


    @ApiHideProperty()
    @ManyToOne( () => RoleEntity, (role) => role.users )
    @JoinColumn({ name: 'role' })
    role: RoleEntity;

}