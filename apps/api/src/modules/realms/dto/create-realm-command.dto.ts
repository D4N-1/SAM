import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";


export class CreateRealmCommandDto {

    @ApiProperty({
        description: 'El nombre del comando que se activará',
        example: 'general'
    })
    @IsNotEmpty()
    @IsString()
    commandName: string;

    @ApiProperty({
        description: 'Si el comando estará activo o bloqueado',
        example: DTO.BOOLEAN + DTO.OPTIONAL
    })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

}