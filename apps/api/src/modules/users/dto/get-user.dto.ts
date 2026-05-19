import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class GetUserQueryDto {

    @ApiProperty({
        description: 'Relaciones extensibles a usuario',
        example: 'contact, role'
    })
    @IsOptional()
    @IsString()
    include?: string;
}