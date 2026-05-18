import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ContactEntity } from "src/modules/contacts/entities/contact.entity";
import { Column, CreateDateColumn, DeleteDateColumn, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BotEntity {

    @ApiHideProperty()
    @PrimaryGeneratedColumn()
    @Exclude()
    index: number;

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

    @ApiProperty({
        description: 'El contacto del dueño del bot',
        type: () => ContactEntity,
    })
    @OneToOne( () => ContactEntity, (contact) => contact.botOwner, {
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'owner_contact' })
    ownerContact: ContactEntity | null;

    @ApiProperty({
        description: 'El token HASHEADO de 6 digitos para registrarse',
        example: 'S4MWWBOT => Hash',
        type: String
    })
    @Column({ type: 'varchar', length: 255, name: 'token_hash', unique: true })
    tokenHash: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
