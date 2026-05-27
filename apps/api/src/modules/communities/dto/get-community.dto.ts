import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { GetAllQueryDto } from "src/common/dto/get.dto";
import { CommunityRelations } from "../entities/community.entity";


export class GetAllCommunityQueryDto extends GetAllQueryDto {

    @ApiProperty({
        description: 'Relaciones extensibles a la comunidad',
        example: CommunityRelations.join(',')
    })
    @IsOptional()
    @IsString()
    include?: string;
    
}