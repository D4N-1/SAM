import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { Not, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { UpdateUserDto } from "./dto/update-user.dto";
import bcrypt from 'bcrypt'
import { SWAGGER } from "src/common/utils/swagger.utils";
import { ContactService } from "../contacts/contact.service";
import { RoleService } from "../roles/roles.service";


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        private readonly roleService: RoleService,
        private readonly contactService: ContactService,

    ) {}

    async findAll(): Promise <UserEntity[]|null> {
        return this.userRepository.find({
            relations: [ 'contact', 'role' ]
        })
    }

    findOneBy = {

        uuid: async (uuid: string): Promise <UserEntity> => {
            const user = await this.userRepository.findOne({
                where: { uuid },
                relations: { contact: true, role: true }
            })

            if (!user) throw new NotFoundException( SWAGGER.NOT_FOUND('usuario') )
            return user
        },
        
        contactUid: async (uid: string): Promise<UserEntity> => {
            const user = await this.userRepository.findOne({
                where: { contact: { uid } },
                relations: { contact: true, role: true }
            })

            if (!user) throw new NotFoundException( ERROR_CODE.NOT_FOUND('usuario') )
            return user
        }
    }

    async create(createUserDto: CreateUserDto): Promise<UserEntity | null> {

        const role = await this.roleService.findOneBy.name( createUserDto.roleName );
        const contact = await this.contactService.findOneBy.uid(createUserDto.contactUid);

        const isContactUsed = await this.userRepository.findOne({
            where: { contact: { index: contact.index } }
        });
        if (isContactUsed) throw new ConflictException( ERROR_CODE.CONFLICT('usuario', 'Este contacto ya está vinculado a otro usuario') );

        const passwordHash = await bcrypt.hash( createUserDto.password, 10 )
        const newUser = this.userRepository.create({
            ...createUserDto,
            passwordHash,
            contact,
            role
        });

        return await this.userRepository.save(newUser);
    }

    async update(uuid: string, updateUserDto: UpdateUserDto): Promise<UserEntity | null> {
        const user = await this.findOneBy.uuid( uuid )
        
        const updateData: Partial<UserEntity> = {}
        if (updateUserDto.description) updateData.description = updateUserDto.description
        if (updateUserDto.imageUrl) updateData.imageUrl = updateData.imageUrl

        if (updateUserDto.contactUid) {
            const contact = await this.contactService.findOneBy.uid(updateUserDto.contactUid);

            const contactUsed = await this.userRepository.findOne({
                where: { contact: { index: contact.index }, uuid: Not(uuid) }
            });
            if (contactUsed) throw new ConflictException( ERROR_CODE.CONFLICT('usuario', 'Este contacto ya está vinculado a otro usuario') );

            updateData.contact = contact;
        }

        if (updateUserDto.roleName) updateData.role = await this.roleService.findOneBy.name( updateUserDto.roleName )
        if (updateUserDto.password) updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10)

        const updatedUser = this.userRepository.merge(user, updateData);

        return await this.userRepository.save(updatedUser);
    }

    async delete(uuid: string) {

        const contact = await this.findOneBy.uuid( uuid )

        return {
            message: 'Usuario ELIMINADO',
            user: await this.userRepository.softRemove(contact)
        }
    }

    async recover(uuid: string) {

        const user = await this.userRepository.findOne({
            where: { uuid },
            withDeleted: true
        });

        if (!user) throw new NotFoundException( ERROR_CODE.NOT_FOUND('usuario') );
        if (!user.deletedAt) throw new ConflictException( ERROR_CODE.CONFLICT('usuario', 'El usuario no ha sido eliminado aun') )

        return await this.userRepository.recover(user)

    }
}