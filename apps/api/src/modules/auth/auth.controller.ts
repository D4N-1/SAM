import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Private } from 'src/decorators/private.decorator';
import { SWAGGER } from 'src/common/utils/swagger.utils';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { msgWRONG_PASSWORD } from 'src/common/messages/error.message';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { AuthenticatedRequest } from 'src/common/types/req-user.type';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiOkResponse({ description: 'Ingreso al sistema, correcto', example: { access_token: '12345' } })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('usuario'), schema: { example: ERROR_CODE.NOT_FOUND('usuario') } })
  @ApiUnauthorizedResponse({ description: msgWRONG_PASSWORD, schema: { example: ERROR_CODE.UNAUTHORIZED( msgWRONG_PASSWORD ) } })
  @Post('login')
  login(@Body() signInDto: CreateAuthDto) {
    return this.authService.signIn(signInDto.uid, signInDto.password)
  }

  @ApiBearerAuth()
  @Private()
  @Get('me')
  profile(@CurrentUser () request: AuthenticatedRequest) {
    console.log(request)
    return this.authService.profile(request.user.uuid)
  }

}
