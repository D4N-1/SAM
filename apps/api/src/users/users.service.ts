import { ConflictException, Injectable } from '@nestjs/common';
import { UsersEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private userRepository: Repository<UsersEntity>
    ) {}

    async create(CreateUserDto: CreateUserDto) {
        const { username, password } = CreateUserDto

        const exists = await this.userRepository.findOneBy({ username })

        if (exists) throw new ConflictException('Este usuario ya existe')

        const saltedRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltedRounds);

        const newUser = this.userRepository.create({
            username,
            password: hashedPassword
        })

        return await this.userRepository.create(newUser)
    }
}
