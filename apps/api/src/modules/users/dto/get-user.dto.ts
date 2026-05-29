import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { GetAllQueryDto } from "src/common/dto/get.dto";
import { UserRelations } from "../entities/user.entity";


export class GetAllUserQueryDto extends GetAllQueryDto {

    @ApiProperty({
        description: 'Relaciones extensibles a usuario',
        example: UserRelations.join(',')
    })
    @IsOptional()
    @IsString()
    include?: string;
}