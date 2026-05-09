import { enumRole } from "src/common/enums/role.enum";
import { Entity, PrimaryGeneratedColumn, Column, Index, Generated } from "typeorm";

@Entity('roles')
export class RoleEntity {

    @PrimaryGeneratedColumn()
    index: number;

    @Column({ type: 'uuid', unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({
        type: 'enum',
        enum: enumRole,
        default: enumRole.USER,
        unique: true
    })
    name: enumRole;

}
