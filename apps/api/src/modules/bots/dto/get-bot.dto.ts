import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { GetAllQueryDto } from "src/common/dto/get.dto";
import { BotRelations } from "../entities/bot.entity";


export class GetAllBotQueryDto extends GetAllQueryDto {

    @ApiProperty({
        description: 'Relaciones extensibles al Bot',
        example: BotRelations.join(',')
    })
    @IsOptional()
    @IsString()
    include: string;
}