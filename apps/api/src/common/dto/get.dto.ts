import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetQueryDto {

    @ApiProperty({
        description: 'Limitar la cantidad de entidades por página',
        example: '10'
    })
    @IsOptional()
    @IsString()
    limit?: string;

    @ApiProperty({
        description: 'Especificar el número de página',
        example: 2
    })
    @IsString()
    @IsOptional()
    page?: string;
}