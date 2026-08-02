import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt'
import { msgWRONG_PASSWORD } from 'src/common/messages/error.message';
import { ReqCodeUserDto, SignInUserDto } from './dto/sign-user.dto';
import { SignInBotDto } from './dto/sign-bot.dto';
import { BotService } from '../bots/bot.service';
import { ClientRequest } from 'src/common/interfaces/req-client.type';
import { enumClients } from 'src/common/enums/role.enum';
import { BotSocketService } from '../bot-socket/bot-socket.service';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly botService: BotService,

    @Inject( forwardRef( () => BotSocketService))
    private readonly botSocketService: BotSocketService
  ) {}

  signIn = {

    user: async (signInUserDto: SignInUserDto) => {

      const { contactUid, password, code, email } = signInUserDto;

      let user;
      if (contactUid) user = await this.userService.findOneBy.contactUid(contactUid, true);
        else if (email) user = await this.userService.findOneBy.email(email, true);

      if (!user) throw new NotFoundException( ERROR_CODE.NOT_FOUND('usuario') )

        console.log(user)
        console.log(signInUserDto)

      let match;

      if (password && password.length > 0) match = await compare(password, user.passwordHash);
        else if (code === 'R00252') match = true

      if ( !match && password ) throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED( msgWRONG_PASSWORD ) )
        else if ( !match && code ) throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED( 'Codigo de un solo uso inválido' ) )
          else if ( !match ) throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED( 'Para ingresar, se debe proporcionar PASSWORD o CODIGO de un solo uso' ) )


      const payload: ClientRequest = {
        type: enumClients.USER,
        uuid: user.uuid,
        name: user.name,
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

  async reqUserCode(reqCodeUserDto: ReqCodeUserDto) {
    const { contactUid, email } = reqCodeUserDto


    let user;

    if (contactUid) user = await this.userService.findOrNull.contactUid(contactUid)
      else if (email) user = await this.userService.findOrNull.email(email)

    if (!user && contactUid) throw new NotFoundException( ERROR_CODE.NOT_FOUND('usuario', 'No se encontró el usuario por contactUid') )
      else if (!user && email) throw new NotFoundException( ERROR_CODE.NOT_FOUND('usuario', 'No se encontró el usuario por correo') )
        else if (!user) throw new NotFoundException( ERROR_CODE.NOT_FOUND('usuario', 'Para poder solicitar codigo, se debe ingresar su contactUid o Correo') )

    return this.botSocketService.sendVerificationCode('R00252', contactUid!)


  }


  async getUser(uuid: string) {

    const user = await this.userService.findOrNull.uuid(uuid)
    const bot = await this.botService.findOrNull.uuid(uuid)

    if (!user && !bot) throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED('No existe algún usuario o bot ligado a este token') )

    return user || bot;
  }


  async verifyToken(token: string): Promise<ClientRequest> {

    if ( token?.startsWith('Bearer') ) token = token?.replace('Bearer ', '').trim()

    const payload = await this.jwtService.verify(token)
    
    await this.getUser(payload?.uuid)

    return payload
  }

}
