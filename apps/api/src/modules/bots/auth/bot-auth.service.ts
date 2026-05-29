import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BotAuthEntity } from "../entities/bot-auth.entity";
import { Repository } from "typeorm";
import { BotService } from "../bot.service";
import { SaveAuthDto } from "../dto/save-bot-auth.dto";


@Injectable()
export class BotAuthService {

    constructor(
        @InjectRepository(BotAuthEntity)
        private readonly botAuthRepository: Repository<BotAuthEntity>,

        private readonly botService: BotService

    ) {}


    async deleteAllAuthKey(botUid: string) {

        await this.botAuthRepository.delete(({ botUid }))

        return {
            message: `Todas las credenciales del bot ${botUid} han sido elimindas`
        }
    }


    async saveAuthKey(saveAuthDto: SaveAuthDto) {

        const { botUid, key, value } = saveAuthDto;


        const bot = await this.botService.findOneBy.contactUid(botUid)

        let auth = await this.botAuthRepository.findOne({
            where: { botUid, key }
        })

        const stringifyValue = JSON.stringify(value);

        if (auth) {
            auth.value = stringifyValue
            return await this.botAuthRepository.save(auth)

        } else {

            try {
                const newAuth = this.botAuthRepository.create({
                    botUid,
                    key,
                    value: stringifyValue
                })
            
                return await this.botAuthRepository.save(newAuth)

            } catch (error:any) {

                if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                    console.log(`RACE CONDITION detectado para ${botUid}-${key}, actualizando...`)

                    auth = await this.botAuthRepository.findOne({
                        where: {
                            botUid, key
                        }
                    });
                    if (auth) {
                        auth.value = stringifyValue;
                        return await this.botAuthRepository.save(auth)
                    }
                } else throw error;
            }
        }
    }


    async getAuthKey(botUid: string, key: string) {
        const auth = await this.botAuthRepository.findOne({
            where: {
                botUid,
                key
            }
        })

        if (!auth) return null;
            return auth.value;
    }
}