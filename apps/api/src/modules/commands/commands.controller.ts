import { Controller, Get, Param } from '@nestjs/common';
import { CommandService } from './commands.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { API_PARAM } from 'src/common/constants/api-param';
import { pipeValidateUuid } from 'src/pipes/uuid.pipe';
import { enumCommand } from 'src/common/enums/command.enum';
import { SWAGGER } from 'src/common/utils/swagger.utils';
import { CommandEntity } from './entities/command.entity';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { Private } from 'src/decorators/private.decorator';

@Private() @ApiBearerAuth()
@ApiTags('Comandos')
@Controller('commands')
export class CommandController {
  constructor(private readonly commandsService: CommandService) {}

  @Get()
  findAll() {
    return this.commandsService.findAll();
  }

  @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('comando') })
  @ApiOkResponse({ description: SWAGGER.OK.FIND('comando'), type: CommandEntity })
  @ApiBadRequestResponse({ description: SWAGGER.BAD_RQUEST(), schema: { example: ERROR_CODE.BAD_REQUEST('PATH') } })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('comando'), schema: { example: ERROR_CODE.NOT_FOUND('comando') } })
  @ApiParam(API_PARAM.UUID)
  @Get('uuid/:uuid')
  async getUuid(@Param('uuid', pipeValidateUuid) uuid: string) {
    return this.commandsService.findOneBy.uuid(uuid)
  }


  @ApiOperation({ summary: SWAGGER.SUMMARY.FIND('comando') })
  @ApiOkResponse({ description: SWAGGER.OK.FIND('comando'), type: CommandEntity })
  @ApiNotFoundResponse({ description: SWAGGER.NOT_FOUND('comando'), schema: { example: ERROR_CODE.NOT_FOUND('comando') } })
  @ApiParam(API_PARAM.NAME)
  @Get('name/:name')
  async getName(@Param('name') name: enumCommand) {
    return this.commandsService.findOneBy.name(name);
  }

}
