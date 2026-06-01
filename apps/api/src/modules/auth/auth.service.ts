import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt'
import { msgWRONG_PASSWORD } from 'src/common/messages/error.message';
import { SignInUserDto } from './dto/sign-user.dto';
import { SignInBotDto } from './dto/sign-bot.dto';
import { BotService } from '../bots/bot.service';
import { ClientRequest } from 'src/common/interfaces/req-client.type';
import { enumClients } from 'src/common/enums/role.enum';


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

      const match = await compare(password, user.passwordHash!)
      if ( !match ) throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED( msgWRONG_PASSWORD ) )

      const payload: ClientRequest = {
        type: enumClients.USER,
        uuid: user.uuid,
        role: user?.role?.name
      }

      return {
        message: 'Inicio de sesión correcto',
        access_token: await this.jwtService.signAsync(payload)
      }
      
    },
    
    bot: async(signInBotDto: SignInBotDto) => {

      const { contactUid, code } = signInBotDto;

      const bot = await this.botService.findOneBy.contactUid(contactUid)

      if (!bot.codeHash) throw new ForbiddenException( ERROR_CODE.FORBIDDEN('El bot aun no tiene CODIGO registrado') )

      const match = await compare(code, bot.codeHash)
      if (!match) throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED('El CODIGO es incorrecto') )

      const payload: ClientRequest = {
        type: enumClients.BOT,
        uuid: bot.uuid,
        contactUid: bot.contact.uid,
        ownerContactUid: bot.ownerContact?.uid,
        role: bot.role
      }

      return {
        message: 'Bot autorizado',
        access_token: await this.jwtService.signAsync(payload)
      }
    }

  }

    async profile(uuid: string) {

      const user = await this.userService.findOrNull.uuid(uuid)
      const bot = await this.botService.findOrNull.uuid(uuid)

      return user || bot;
    }
}
