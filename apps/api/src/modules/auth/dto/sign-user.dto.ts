import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";


export class ReqCodeUserDto {
    @ApiProperty({
        example: DTO.UID
    })
    @IsString()
    @IsOptional()
    contactUid?: string|undefined;

    @ApiProperty({
        example: DTO.EMAIL
    })
    @IsString()
    @IsOptional()
    email?: string|undefined;


}


export class SignInUserDto extends ReqCodeUserDto {

    @ApiProperty({
        example: DTO.PASSWORD
    })
    @IsString()
    @IsOptional()
    password?: string|undefined;

    @ApiProperty({
        example: DTO.CODE
    })
    @IsString()
    @IsOptional()
    code?: string|undefined;

}