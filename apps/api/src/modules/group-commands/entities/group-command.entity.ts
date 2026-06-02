import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { CommandEntity } from "src/modules/commands/entities/command.entity";
import { GroupEntity } from "../../groups/entities/group.entity";


export const groupCommandRelations = [ 'group', 'command' ]

@Unique([ 'group', 'command' ])
@Entity('uni_group_command')
export class GroupCommandEntity extends BaseEntity {

    @ManyToOne( () => GroupEntity, (group) => group.commands )
    @JoinColumn({ name: 'group' })
    group: GroupEntity;

    @ManyToOne( () => CommandEntity, (command) => command.groups )
    @JoinColumn({ name: 'command' })
    command: CommandEntity

    @Column({ type: 'boolean', default: true })
    active: boolean;


}