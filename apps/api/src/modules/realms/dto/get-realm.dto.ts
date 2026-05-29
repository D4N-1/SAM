import { ApiProperty } from "@nestjs/swagger";
import { GetAllQueryDto } from "src/common/dto/get.dto";
import { RealmRelations } from "../entities/realm.entity";
import { IsOptional, IsString } from "class-validator";


export class GetAllRealmQueryDto extends GetAllQueryDto {

    @ApiProperty({
        description: 'Las relaciones extensibles al grupo',
        example: RealmRelations.join(',')
    })
    @IsOptional()
    @IsString()
    include?: string;
}