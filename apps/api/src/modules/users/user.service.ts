import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { Not, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { ERROR_CODE } from "src/common/messages/error.message";
import { RoleEntity } from "../roles/entities/role.entity";
import { ContactEntity } from "../contacts/entities/contact.entity";
import { UpdateUserDto } from "./dto/update-user.dto";


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,

        @InjectRepository(ContactEntity)
        private readonly contactRepository: Repository<ContactEntity>
    ) {}

    async getAll(): Promise <UserEntity[]|null> {
        return this.userRepository.find({
            relations: [ 'contact', 'role' ]
        })
    }

    async getByUuid(uuid: string): Promise <UserEntity|null> {
        return this.userRepository.findOne({
            where: { uuid },
            relations: [ 'contact', 'role' ]
        })
    }

    async create(createUserDto: CreateUserDto): Promise<UserEntity | null> {

        const role = await this.roleRepository.findOneBy({ name: createUserDto.roleName });
        if (!role) throw new NotFoundException('El rol especificado no existe');

        const contact = await this.contactRepository.findOneBy({ uid: createUserDto.contactUid });
        if (!contact) throw new NotFoundException('El contacto no existe');

        const contactUsed = await this.userRepository.findOne({
            where: { contact: { index: contact.index } }
        });
        if (contactUsed) throw new ConflictException('Este contacto ya está vinculado a un usuario');

        const newUser = this.userRepository.create({
            ...createUserDto,
            contact: contact,
            role: role
        });

        return await this.userRepository.save(newUser);
    }

    async update(uuid: string, updateUserDto: UpdateUserDto): Promise<UserEntity | null> {
        const user = await this.userRepository.findOne({ 
            where: { uuid },
            relations: ['contact', 'role'] 
        });

        if (!user) throw new NotFoundException( ERROR_CODE.NOT_FOUND() );

        const updateData: Partial<UserEntity> = { ...updateUserDto as any };

        if (updateUserDto.contactUid) {
            const contact = await this.contactRepository.findOneBy({ uid: updateUserDto.contactUid });
            if (!contact) throw new NotFoundException('El contacto especificado no existe');

            const contactUsed = await this.userRepository.findOne({
                where: { 
                    contact: { index: contact.index },
                    uuid: Not(uuid)
                }
            });

            if (contactUsed) throw new ConflictException('Este contacto ya está vinculado a otro usuario');

            updateData.contact = contact;
        }

        if (updateUserDto.roleName) {
            const role = await this.roleRepository.findOneBy({ name: updateUserDto.roleName });
            if (!role) throw new NotFoundException('El rol especificado no existe');

            updateData.role = role;
        }

        const updatedUser = this.userRepository.merge(user, updateData);

        return await this.userRepository.save(updatedUser);
    }
}