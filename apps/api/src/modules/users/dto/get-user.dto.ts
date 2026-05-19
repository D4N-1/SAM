import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { GetQueryDto } from "src/common/dto/get.dto";


export class GetUserQueryDto extends GetQueryDto {

    @ApiProperty({
        description: 'Relaciones extensibles a usuario',
        example: 'contact, role'
    })
    @IsOptional()
    @IsString()
    include?: string;
}