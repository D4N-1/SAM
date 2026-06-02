import { ApiProperty } from "@nestjs/swagger";
import { GetAllQueryDto } from "src/common/dto/get.dto";
import { IsOptional, IsString } from "class-validator";
import { RealmCommandRelations } from "../entities/realm-command.entity";


export class GetAllRealmCommandQueryDto extends GetAllQueryDto {

    @ApiProperty({
        description: 'Las relaciones extensibles al grupo',
        example: RealmCommandRelations.join(',')
    })
    @IsOptional()
    @IsString()
    include?: string;
}