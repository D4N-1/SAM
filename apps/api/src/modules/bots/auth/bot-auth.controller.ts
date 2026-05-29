import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { SWAGGER } from "src/common/utils/swagger.utils";
import { BotAuthService } from "./bot-auth.service";
import { SaveAuthDto } from "../dto/save-bot-auth.dto";
import { API_PARAM } from "src/common/constants/api-param";

@ApiTags('Bot Auth')
@Controller('bots/auth')
export class BotAUthController {

    constructor(
        private readonly botAuthService: BotAuthService
    ) {}

    @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('bot auth') })
    @Get(':botUid/:key')
    async getAuthKey(@Param('botUid') botUid: string, @Param('key') key: string) {
        return this.botAuthService.getAuthKey(botUid, key)

    }

    @Post()
    async saveAuthKey(@Body() saveAuthDto: SaveAuthDto) {
        return this.botAuthService.saveAuthKey(saveAuthDto)
    }

    @Delete(':uid')
    @ApiParam(API_PARAM.UID)
    async deleteAllAuthKey(@Param('uid') botUid: string){
        return this.botAuthService.deleteAllAuthKey(botUid)
    }
}