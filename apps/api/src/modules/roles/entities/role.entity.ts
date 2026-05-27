import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { DTO } from "src/common/constants/generic.dto";
import { enumRole } from "src/common/enums/role.enum";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, Generated, OneToMany } from "typeorm";

@Entity('roles')
export class RoleEntity {

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

    @ApiProperty({
        description: 'El nombre del rol',
        example: enumRole.USER,
        type: String,
    })
    @Column({
        type: 'enum',
        enum: enumRole,
        default: enumRole.USER,
        unique: true
    })
    name: enumRole;

    @ApiHideProperty()
    @OneToMany( () => UserEntity, (user) => user.role)
    users: UserEntity[];
}
