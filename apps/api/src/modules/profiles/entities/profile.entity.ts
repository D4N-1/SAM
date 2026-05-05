import { CommunityEntity } from "src/modules/communities/entities/community.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { PrimaryGeneratedColumn, ManyToOne, Column, Entity, Unique } from "typeorm";

@Entity('profiles')
@Unique([ 'user', 'community' ])
export class ProfileEntity {

    @PrimaryGeneratedColumn()
    index: number;

    @ManyToOne( () => UserEntity, user => user.profiles, {
        onDelete: 'CASCADE'
    })
    user: UserEntity

    @ManyToOne( () => CommunityEntity, community => community.profiles, {
        onDelete: 'CASCADE'
    })
    community: CommunityEntity;

    @Column()
    name: string;
}
