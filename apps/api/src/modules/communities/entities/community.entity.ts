import { ProfileEntity } from "src/modules/profiles/entities/profile.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('communities')
export class CommunityEntity {
    @PrimaryGeneratedColumn()
    index: number;

    @Column()
    id: string;

    @Column()
    name: string;

    @OneToMany( () => ProfileEntity, profile => profile.community)
    profiles: ProfileEntity[]
}
