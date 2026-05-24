import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { DTO } from "src/common/constants/generic.dto";

export class SignInUserDto {

    @ApiProperty({
        example: DTO.UID
    })
    @IsString()
    contactUid: string;

    @ApiProperty({
        example: DTO.PASSWORD
    })
    @IsString()
    password: string;
}