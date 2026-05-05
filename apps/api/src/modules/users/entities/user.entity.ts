import { AuthEntity } from "src/modules/auth/entities/auth.entity";
import { ProfileEntity } from "src/modules/profiles/entities/profile.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    index: number;

    @Column()
    id: string;

    @Column()
    name: string;
    
    @OneToMany( () => ProfileEntity, profile => profile.user)
    profiles: ProfileEntity[];

    //@OneToMany( () => AuthEntity, auth => auth.user)
    //auths: AuthEntity;

    @Column()
    password: string;
}