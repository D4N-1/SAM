import { ConflictException, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

}
