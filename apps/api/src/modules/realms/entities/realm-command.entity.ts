import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { RealmEntity } from "./realm.entity";
import { CommandEntity } from "src/modules/commands/entities/command.entity";


export const RealmCommandRelations = [ 'realm', 'command' ]

@Unique([ 'realm', 'command' ])
@Entity('uni_realm_command')
export class RealmCommandEntity extends BaseEntity {


    @ManyToOne( () => RealmEntity, (realm) => realm.commands )
    @JoinColumn({ name: 'realm' })
    realm: RealmEntity;

    @ManyToOne( () => CommandEntity, (command) => command.realms )
    @JoinColumn({ name: 'command' })
    command: CommandEntity

    @Column({ type: 'boolean', default: true })
    active: boolean;


}