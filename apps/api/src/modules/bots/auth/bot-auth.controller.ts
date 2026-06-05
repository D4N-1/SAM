import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { SWAGGER } from "src/common/utils/swagger.utils";
import { BotAuthService } from "./bot-auth.service";
import { API_PARAM } from "src/common/constants/api-param";
import { BotAuthEntity } from "../entities/bot-auth.entity";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { Private } from "src/decorators/private.decorator";
import { Roles } from "src/decorators/roles-user.decorator";
import { enumRole } from "src/common/enums/role.enum";
import { SkipThrottle } from "@nestjs/throttler";


@SkipThrottle()
@Private() @Roles([ enumRole.ADMIN ]) @ApiBearerAuth()
@ApiTags('Bot Auth')
@Controller('bots/auth')
export class BotAUthController {

    constructor(
        private readonly botAuthService: BotAuthService
    ) {}

    @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('bot auth') })
    @ApiOkResponse({ description: SWAGGER.OK.FIND('bot auth'), type: BotAuthEntity })
    @ApiParam(API_PARAM.UID)
    @Get(':uid/:key')
    async getAuthKey(@Param('uid') uid: string, @Param('key') key: string) {
        return this.botAuthService.getAuthKey(uid, key)
    }

    
    @ApiOperation({ summary: SWAGGER.SUMMARY.CREATE('bot auth') })
    @ApiCreatedResponse({ description: SWAGGER.OK.CREATE('bot auth'), type: BotAuthEntity })
    @ApiConflictResponse({ description: SWAGGER.CONFLICT('bot auth'), schema: { example: ERROR_CODE.CONFLICT('bot auth') } })
    @Post()
    async saveAuthKey(@Body() saveAuthDto: any) {
        console.log(`LA API RECIBE UN: ${typeof saveAuthDto.value}`)
        return this.botAuthService.saveAuthKey(saveAuthDto)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.DELETE('bot auth') })
    @ApiOkResponse({ description: SWAGGER.OK.DELETE('bot auth'), type: BotAuthEntity })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('bot auth'), schema: { example: ERROR_CODE.NOT_FOUND('bot auth') } })
    @ApiParam(API_PARAM.UID)
    @Delete(':uid')
    async deleteAllAuthKey(@Param('uid') uid: string){
        return this.botAuthService.deleteAllAuthKey(uid)
    }

    @ApiOperation({ summary: SWAGGER.SUMMARY.DELETE('bot auth') })
    @ApiOkResponse({ description: SWAGGER.OK.DELETE('bot auth'), type: BotAuthEntity })
    @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('bot auth'), schema: { example: ERROR_CODE.NOT_FOUND('bot auth') } })
    @ApiParam(API_PARAM.UID)
    @Delete(':uid/:key')
    async deleteAuthKey(@Param('uid') uid: string, @Param('key') key: string){
        return this.botAuthService.deleteAuthKey(uid, key)
    }
}