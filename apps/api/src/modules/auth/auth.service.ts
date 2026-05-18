import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt'
import { msgWRONG_PASSWORD } from 'src/common/messages/error.message';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

    async signIn(userContactUid: string, password: string) {

      const user = await this.userService.findOneBy.contactUid(userContactUid)

      const match = await bcrypt.compare(password, user.passwordHash!)
      if ( !match ) throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED( msgWRONG_PASSWORD ) )

      const payload = {
        uuid: user.uuid,
        role: user.role.name
      }

      return {
        message: 'Inicio de sesión correcto',
        access_token: await this.jwtService.signAsync(payload)
      }
      
    }

    async profile(uuid: string) {

      return this.userService.findOneBy.uuid(uuid)
    }
}
