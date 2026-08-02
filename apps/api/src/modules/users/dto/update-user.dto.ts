import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { enumRole } from "src/common/enums/role.enum";
import { DTO } from "src/common/constants/generic.dto";


export class UpdateUserDto extends PartialType(CreateUserDto) {


}