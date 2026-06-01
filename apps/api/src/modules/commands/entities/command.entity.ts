import { ApiHideProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entities/base.entity";
import { RealmCommandEntity } from "src/modules/realms/entities/uni-realm-command.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('commands')
export class CommandEntity extends BaseEntity {

    @Column()
    name: string;

    ///////////////

    @ApiHideProperty()
    @OneToMany( () => RealmCommandEntity, (realmCommand) => realmCommand.command)
    realms: RealmCommandEntity[];

}
