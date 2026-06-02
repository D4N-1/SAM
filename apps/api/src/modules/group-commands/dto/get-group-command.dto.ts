import { ApiProperty } from "@nestjs/swagger";
import { GetAllQueryDto } from "src/common/dto/get.dto";
import { IsOptional, IsString } from "class-validator";
import { groupCommandRelations } from "../entities/group-command.entity";


export class GetAllGroupCommandQueryDto extends GetAllQueryDto {

    @ApiProperty({
        description: 'Las relaciones extensibles al grupo',
        example: groupCommandRelations.join(',')
    })
    @IsOptional()
    @IsString()
    include?: string;
}