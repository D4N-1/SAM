import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { GetAllQueryDto } from "src/common/dto/get.dto";


export class GetAllUserQueryDto extends GetAllQueryDto {

    @ApiProperty({
        description: 'Relaciones extensibles a usuario',
        example: 'contact,role'
    })
    @IsOptional()
    @IsString()
    include?: string;
}