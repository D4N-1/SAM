import { ApiHideProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entities/base.entity";
import { GroupCommandEntity } from "src/modules/group-commands/entities/group-command.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('commands')
export class CommandEntity extends BaseEntity {

    @Column()
    name: string;

    ///////////////

    @ApiHideProperty()
    @OneToMany( () => GroupCommandEntity, (groupCommand) => groupCommand.command)
    groups: GroupCommandEntity[];

}
