import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt'
import { msgWRONG_PASSWORD } from 'src/common/messages/error.message';
import { SignInUserDto } from './dto/sign-user.dto';
import { SignInBotDto } from './dto/sign-bot.dto';
import { BotService } from '../bots/bot.service';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly botService: BotService
  ) {}

  signIn = {

    user: async (signInUserDto: SignInUserDto) => {

      const { contactUid, password } = signInUserDto;

      const user = await this.userService.findOneBy.contactUid(contactUid)

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
      
    },
    
    bot: async(signInBotDto: SignInBotDto) => {

      const { contactUid, token } = signInBotDto;

      const bot = await this.botService
    }

  }

    async profile(uuid: string) {

      return this.userService.findOneBy.uuid(uuid)
    }
}
