import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { BotEntity } from "./bot.entity";


@Entity('bot_auth')
@Unique(['bot', 'key'])
export class BotAuthEntity {

    @ApiHideProperty()
    @Exclude()
    @PrimaryGeneratedColumn()
    index: number;


    @ApiHideProperty()
    @ManyToOne( () => BotEntity, (bot) => bot.auth, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'bot' })
    bot: BotEntity;


    @ApiProperty({
        description: 'Tipo de dato'
    })
    @Column()
    key: string;


    @ApiProperty({
        description: 'El JSON de llaves'
    })
    @Column({ type: 'longtext' })
    value: string;
}