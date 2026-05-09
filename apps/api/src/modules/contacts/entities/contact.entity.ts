import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";


@Entity('contacts')
export class ContactEntity {

    @PrimaryGeneratedColumn()
    index: number;

    @Column({
        type: 'varchar',
        length: 35,
        unique: true
    })
    uid: string;

    @Column({
        type: 'varchar',
        length: 35,
        unique: true,
        nullable: true
    })
    lid?: string;

    @Column({
        type: 'varchar',
        length: 25,
        nullable: true
    })
    name?: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at'

    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at'

    })
    deletedAt: Date;
}