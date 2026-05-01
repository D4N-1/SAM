import { Column, Entity, Generated, Index, JoinColumn, ManyToMany, PrimaryColumn, JoinTable, DeleteDateColumn } from "typeorm";
import { AnimeFormat } from "src/common/enums/anime-format.enum";
import { AnimeSeason } from "src/common/enums/anime-season.enum";
import { GendersEntity } from "src/genders/entities/gender.entity";

@Entity('animes')
export class AnimesEntity {

    @Column()
    @Generated('increment')
    @Index({ unique: true })
    index: number;

    @PrimaryColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    native: string;

    @Column({ type: 'varchar' })
    romaji: string;

    @Column({ type: 'varchar', nullable: true })
    english: string;

    @Column({
        type: 'enum',
        enum: AnimeFormat,
        default: AnimeFormat.TV
    })
    format: AnimeFormat;

    @Column({ type: 'text', nullable: true })
    desc: string;

    @Column({ type: 'boolean', default: false })
    is_adult: boolean;

    @Column({ type: 'int', default: 0 })
    score: number;

    @Column({ type: 'int', default: 0 })
    likes: number;

    @ManyToMany(() => GendersEntity, (gender) => gender.animes)
    @JoinTable({
        name: 'uni_animes_genders',
        joinColumn: { name: 'anime_id', referencedColumnName: 'index' },
        inverseJoinColumn: { name: 'gender_id', referencedColumnName: 'index' }
    })
    genders: GendersEntity[];

    @Column({ type: 'int', nullable: true })
    episodes: number;

    @Column({ type: 'date', nullable: true })
    date_start: Date;

    @Column({ type: 'date', nullable: true })
    date_end: Date;

    @Column({
        type: 'enum',
        enum: AnimeSeason,
        default: AnimeSeason.SPRING
    })
    season: AnimeSeason;

    @Column({
        type: 'year',
        nullable: true
    })
    year: number;

    @DeleteDateColumn({ name: 'deleted_at', select: false })
    deleted_at: Date;
}