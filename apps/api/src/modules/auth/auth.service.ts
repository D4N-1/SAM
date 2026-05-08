import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private UserRepository: Repository<UserEntity>,

    private JwtService: JwtService
  ) {}

  

  async login(id: string, password: string) {

    const user = await this.UserRepository.findOneBy({ id })

    if (!user) throw new UnauthorizedException('No existe ese usuario')

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = {
      index: user.index,
      id: user.id,
      role: user.role
    }

    return {
      access_token: this.JwtService.sign(payload)
    }
  }

  async findOne(index: number) {
    return this.UserRepository.findOneBy({ index: index })
  }
}
