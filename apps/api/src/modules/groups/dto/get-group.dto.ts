import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { GetAllQueryDto } from "src/common/dto/get.dto";


export class GetAllGroupQueryDto extends GetAllQueryDto {

    @ApiProperty({
        description: 'Relaciones extensibles al grupo',
        example: 'community'
    })
    @IsOptional()
    @IsString()
    include?: string;
    
}