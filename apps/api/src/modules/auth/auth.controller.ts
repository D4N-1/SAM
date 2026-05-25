import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SignInUserDto } from './dto/sign-user.dto';
import { Private } from 'src/decorators/private.decorator';
import { SWAGGER } from 'src/common/utils/swagger.utils';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { msgWRONG_PASSWORD } from 'src/common/messages/error.message';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { ClientRequest } from 'src/common/interfaces/req-client.type';
import { SignInBotDto } from './dto/sign-bot.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiOkResponse({ description: 'Ingreso al sistema correcto', example: { message: 'si', access_token: '12345' } })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('usuario'), schema: { example: ERROR_CODE.NOT_FOUND('usuario') } })
  @ApiUnauthorizedResponse({ description: msgWRONG_PASSWORD, schema: { example: ERROR_CODE.UNAUTHORIZED( msgWRONG_PASSWORD ) } })
  @Post('user/login')
  userLogin(@Body() signInDto: SignInUserDto) {
    return this.authService.signIn.user(signInDto)
  }

  @ApiBearerAuth()
  @Private()
  @Get('me')
  profile(@CurrentUser() user: ClientRequest) {

    return this.authService.profile(user.uuid)
  }

  @ApiOperation({ summary: 'Inicio de sesión como BOT' })
  @ApiOkResponse({ description: 'Ingreso al sistema correcto', example: { message: 'si', access_token: '12345' } })
  @ApiNotFoundResponse({ description: 'Bot no encontrado', schema: { example: ERROR_CODE.NOT_FOUND('bot') } })
  @Post('bot/login')
  botLogin(@Body() signInDto: SignInBotDto) {
    return this.authService.signIn.bot(signInDto)
  }

}
