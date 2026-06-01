import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Not, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { UpdateUserDto } from "./dto/update-user.dto";
import bcrypt from 'bcrypt'
import { SWAGGER } from "src/common/utils/swagger.utils";
import { ContactService } from "../contacts/contact.service";
import { RoleService } from "../roles/role.service";
import { AllResponse } from "src/common/interfaces/response.type";
import { enumRole } from "src/common/enums/role.enum";
import { GetAllUserQueryDto } from "./dto/get-user.dto";


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        private readonly roleService: RoleService,
        private readonly contactService: ContactService,

    ) {}

    async findAll(query: GetAllUserQueryDto): Promise<AllResponse> {
        const { include, page = 1, limit = 10 } = query

        const relations = include ? include.split(',') : [];
        const skip = (page - 1) * limit;

        const [ data, total ] = await this.userRepository.findAndCount({
            relations: relations.filter( rel => [ 'contact', 'role' ].includes(rel) ),
            skip,
            take: limit,
            order: { index: 'ASC' }
        });


        return {
            data,
            meta: {
                totalItems: total,
                itemCount: data.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            }
        }
    }

    findOneBy = {

        uuid: async (uuid: string): Promise <UserEntity> => {
            const user = await this.userRepository.findOne({
                where: { uuid },
                relations: { contact: true, role: true }
            })

            if (!user) throw new NotFoundException( ERROR_CODE.NOT_FOUND('usuario') )
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
    };

    findOrNull = {
        uuid: async (uuid: string): Promise <UserEntity|null> => {
            return await this.userRepository.findOne({
                where: { uuid },
                relations: { contact: true, role: true }
            })
        },
    }

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {

        const { name, contactUid, password, roleName, ...newData } = createUserDto;

        const newUserData: Partial<UserEntity> = { ...newData }

        newUserData.role = await this.roleService.findOneBy.name( roleName ?? enumRole.USER );

        const contact = await this.contactService.findOneBy.uid( contactUid );

        const isContactUsed = await this.userRepository.findOne({
            where: { contact: { index: contact.index } }
        });
        if (isContactUsed) throw new ConflictException( ERROR_CODE.CONFLICT('usuario', 'Este contacto ya está vinculado a otro usuario') );
        newUserData.contact = contact;

        const exists = await this.userRepository.findOneBy({ name })
        if (exists) throw new ConflictException( ERROR_CODE.CONFLICT('usuario', 'Ya existe un usuario con ese nombre') )
        newUserData.name = name
        
        newUserData.passwordHash = await bcrypt.hash( createUserDto.password, 10 )

        const newUser = this.userRepository.create( newUserData );

        return await this.userRepository.save(newUser);
    }

    async update(uuid: string, updateUserDto: UpdateUserDto): Promise<UserEntity | null> {
        const user = await this.findOneBy.uuid( uuid )
        
        const { contactUid, roleName, name, password, ...newData } = updateUserDto;
        const updateUserData: Partial<UserEntity> = { ...newData }

        if (contactUid) {
            const contact = await this.contactService.findOneBy.uid(contactUid);

            const contactUsed = await this.userRepository.findOne({
                where: { contact: { index: contact.index }, uuid: Not(uuid) }
            });
            if (contactUsed) throw new ConflictException( ERROR_CODE.CONFLICT('usuario', 'Este contacto ya está vinculado a otro usuario') );

            updateUserData.contact = contact;
        }

        if (name) {
            const exists = await this.userRepository.findOne({
                where: { name, index: Not(user.index) } })
            if (exists) throw new ConflictException( ERROR_CODE.CONFLICT('usuario', 'Ya existe un usuario con ese nombre') )
            
            updateUserData.name = name;
        }

        if (roleName) updateUserData.role = await this.roleService.findOneBy.name( roleName )
        if (password) updateUserData.passwordHash = await bcrypt.hash(password, 10)

        const updatedUser = this.userRepository.merge(user, updateUserData);

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