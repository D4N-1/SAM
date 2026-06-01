import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandEntity } from './entities/command.entity';
import { Repository } from 'typeorm';
import { ERROR_CODE } from 'src/common/utils/error.utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { enumCACHE_KEYS } from 'src/common/enums/cache-keys.enum';

@Injectable()
export class CommandService {

  constructor(
    @InjectRepository(CommandEntity)
    private readonly commandRepository: Repository<CommandEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManage: Cache
  ) {}


  findAll() {
    return this.commandRepository.find()
  }

  findOneBy = {

    uuid: async(uuid: string) => {
      const cacheKey = enumCACHE_KEYS.COMMAND + uuid;

      const cachedCommand = await this.cacheManage.get<CommandEntity>(uuid);
      if (cachedCommand) return cachedCommand;


      const command = await this.commandRepository.findOneBy({ uuid })

      if (!command) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comando') );

      const plainCommand = Object.assign({}, command);
      await this.cacheManage.set(cacheKey, plainCommand);

      return command;
    },

    name: async(name: string) => {
      const cacheKey = enumCACHE_KEYS.COMMAND + name;

      const cachedCommand = await this.cacheManage.get<CommandEntity>(name);
      if (cachedCommand) return cachedCommand;


      const command = await this.commandRepository.findOneBy({ name })

      if (!command) throw new NotFoundException( ERROR_CODE.NOT_FOUND('comando') );

      const plainCommand = Object.assign({}, command);
      await this.cacheManage.set(cacheKey, plainCommand);

      return command;
    },
  }
}
