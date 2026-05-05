import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { AnimesEntity } from "src/modules/animes/entities/anime.entity";

@Entity({ name: 'genders' })
export class GendersEntity {

    @PrimaryGeneratedColumn()
    index: number;

    @Column()
    name: string;

    @ManyToMany(() => AnimesEntity, (anime) => anime.genders)
    animes: AnimesEntity[]

    @DeleteDateColumn({ name: 'deleted_at', select: false })
    deleted_at: Date;
}
