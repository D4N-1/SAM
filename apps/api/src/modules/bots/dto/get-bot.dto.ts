import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { GetAllQueryDto } from "src/common/dto/get.dto";


export class GetAllBotQueryDto extends GetAllQueryDto {

    @ApiProperty({
        description: 'Relaciones extensibles al Bot',
        example: 'contact, ownerContact'
    })
    @IsOptional()
    @IsString()
    include: string;
}