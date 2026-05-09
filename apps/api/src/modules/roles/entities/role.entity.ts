import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { enumRole } from "src/common/enums/role.enum";
import { Entity, PrimaryGeneratedColumn, Column, Generated } from "typeorm";

@Entity('roles')
export class RoleEntity {

    @PrimaryGeneratedColumn()
    @Exclude()
    @ApiHideProperty()
    index: number;

    @Column({ type: 'uuid', unique: true })
    @Generated('uuid')
    @ApiProperty({
        description: 'El identificador unico',
        example: 'abcd-efgh-ijkl-opqr',
        type: String,
        format: 'uuid'
    })
    uuid: string;

    @Column({
        type: 'enum',
        enum: enumRole,
        default: enumRole.USER,
        unique: true
    })
    @ApiProperty({
        description: 'El nombre del rol',
        example: enumRole.USER,
        type: 'string',
    })
    name: enumRole;

}
