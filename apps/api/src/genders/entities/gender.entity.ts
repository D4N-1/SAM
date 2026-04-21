import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { AnimesEntity } from "src/animes/entities/anime.entity";

@Entity({ name: 'genders' })
export class GendersEntity {

    @PrimaryGeneratedColumn()
    index: number;

    @Column()
    name: string;

    @ManyToMany(() => AnimesEntity, (anime) => anime.genders)
    animes: AnimesEntity[]
}
