import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { DTO } from "src/common/constants/generic.dto";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BotAuthEntity } from "./bot-auth.entity";
import { enumBotRole } from "src/common/enums/bot-role.enum";
import { RealmEntity } from "src/modules/realms/entities/realm.entity";
import { BaseEntity } from "src/common/entities/base.entity";

export const BotRelations = [ 'contact', 'ownerContact' ]

@Entity('bots')
export class BotEntity extends BaseEntity {

    @Column({ name: 'contact', type: 'varchar', nullable: true, unique: true, length: 35 })
    contactUid?: string | null;

    @ApiHideProperty()
    @OneToOne( () => ContactEntity, (contact) => contact.bot, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'contact', referencedColumnName: 'uid' })
    contact: ContactEntity;


    @Column({ name: 'owner_contact', type: 'varchar', nullable: true, length: 35 })
    ownerContactUid: string | null;

    @ApiHideProperty()
    @OneToOne( () => ContactEntity, (contact) => contact.botOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'owner_contact', referencedColumnName: 'uid' })
    ownerContact?: ContactEntity | null;


    @ApiProperty({
        description: 'El codigo HASHEADO de 8 digitos para registrarse',
        example: DTO.HASH,
        type: String
    })
    @Column({ type: 'varchar', length: 255, name: 'code_hash', unique: true, nullable: true })
    codeHash?: string;


    @Column({ name: 'role_name', type: 'varchar', nullable: true })
    roleName: string | null;

    @ApiProperty({
        description: 'El rol del bot ( BOT / BEEBOT )',
        example: 'BOT - BEEBOT'
    })
    @Column({ type: 'enum', enum: enumBotRole, default: enumBotRole.BEEBOT })
    role: enumBotRole


    @ApiHideProperty()
    @OneToMany( () => BotAuthEntity, (auth) => auth.bot )
    auth: BotAuthEntity[]

    @ApiHideProperty()
    @OneToOne( () => RealmEntity, (realm) => realm.bot )
    realm: RealmEntity;
}
