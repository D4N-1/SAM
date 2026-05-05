import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entity';
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

    if (!user) {
      const hashed = await bcrypt.hash(password, 10);

      return await this.UserRepository.save({
        id: id,
        name: 'Dani',
        password: hashed,
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) throw new UnauthorizedException('Contraseña incorrecta');

    return {
      access_token: this.JwtService.sign({
        sub: user.index,
        id: user.id
      })
    }
  }
}
