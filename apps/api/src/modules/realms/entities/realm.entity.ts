import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { DTO } from "src/common/constants/generic.dto";
import { BaseEntity } from "src/common/entities/base.entity";
import { BotEntity } from "src/modules/bots/entities/bot.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";


export const RealmRelations = [ 'bot' ]

@Entity('realms')
export class RealmEntity extends BaseEntity {

    @ApiProperty({
        description: 'El nombre único del reino',
        example: DTO.REALM_NAME
    })
    @Column({ unique: true, length: 35 })
    name: string;


    @Column({ name: 'bot', nullable: true })
    botUid: string | null;

    @ApiHideProperty()
    @OneToOne( () => BotEntity, (bot) => bot.realm )
    @JoinColumn({ name: 'bot', referencedColumnName: 'contactUid' })
    bot: BotEntity;


    @ApiProperty({
        description: 'El maximo de grupos',
        example: DTO.SIZE
    })
    @Column({ name: 'max_size', type: 'tinyint', nullable: true, default: 10 })
    maxSize?: number | null

}