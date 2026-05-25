import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import { BotService } from 'src/modules/bots/bot.service';
import { ClientRequest } from 'src/common/interfaces/req-client.type';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { enumClients } from 'src/common/enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
    private readonly botService: BotService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: ClientRequest) {
    
    const user = payload.type === enumClients.USER ? await this.userService.findOrNull.uuid(payload.uuid) : null;
    const bot = payload.type === enumClients.BOT ? await this.botService.findOrNull.uuid(payload.uuid) : null;

    if (!user && !bot) throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED('No existe ese usuario ni bot ligado a tu token') )
    return payload
  }
}