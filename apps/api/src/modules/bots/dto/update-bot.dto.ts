import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBotDto } from './create-bot.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBotDto extends PartialType(CreateBotDto) {

    @ApiProperty({
        example: 'S4MWWBOT'
    })
    @IsString()
    @IsOptional()
    @MaxLength(8)
    code?: string;
}
