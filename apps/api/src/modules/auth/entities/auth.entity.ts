import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('auth')
export class AuthEntity {

    @PrimaryGeneratedColumn()
    index: number;

    @Column()
    type: 'password' | 'whatsapp';

    @Column()
    id: string;

    @Column()
    credential?: string;

    //@ManyToOne( () => UserEntity, user => user.auths)
    //user: UserEntity;
}
