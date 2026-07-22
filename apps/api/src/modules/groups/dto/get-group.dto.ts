import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { GetAllQueryDto } from "src/common/dto/get.dto";
import { GroupRelations } from "../entities/group.entity";


export class GetAllGroupQueryDto extends GetAllQueryDto {

    @ApiProperty({
        description: 'Relaciones extensibles al grupo',
        example: GroupRelations.join(',')
    })
    @IsOptional()
    @IsString()
    include?: string;
    
}