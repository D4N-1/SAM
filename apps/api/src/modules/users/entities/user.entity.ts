import { Column, PrimaryGeneratedColumn } from "typeorm";


export class UsersEntity {
    @PrimaryGeneratedColumn()
    index: number;

    @Column({ unique: true })
    username: string;

    @Column({ select: false })
    password: string;

    @Column({ default: 'admin' })
    role: string;
}