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

    @ApiProperty({
        description: 'Limitar la cantidad de entidades por páginas',
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