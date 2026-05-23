import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('bots')
export class BotEntity {

    @ApiHideProperty()
    @PrimaryGeneratedColumn()
    @Exclude()
    index: number;

    @ApiProperty({
        description: 'El indice único público del bot',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
        format: 'uuid'
    })
    @Column({ type: 'uuid', unique: true })
    @Generated('uuid')
    uuid: string;

    @ApiProperty({
        description: 'El contacto del bot',
        type: () => ContactEntity,
    })
    @OneToOne( () => ContactEntity, (contact) => contact.bot, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'contact' })
    contact: ContactEntity;

    @ApiHideProperty()
    @OneToOne( () => ContactEntity, (contact) => contact.botOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'owner_contact' })
    ownerContact?: ContactEntity | null;

    @ApiProperty({
        description: 'El codigo HASHEADO de 8 digitos para registrarse',
        example: 'S4MWWBOT => Hash',
        type: String
    })
    @Column({ type: 'varchar', length: 255, name: 'code_hash', unique: true, nullable: true })
    codeHash?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
