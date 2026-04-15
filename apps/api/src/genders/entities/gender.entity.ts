import { Entity, Column, PrimaryGeneratedColumn  } from "typeorm"

@Entity()
export class gender {
    @PrimaryGeneratedColumn()
    index: number;

    @Column()
    gender: string;
}