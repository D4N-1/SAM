import { IsInt, IsString } from "class-validator";

export class CreateGenderDto {

    @IsInt()
    index: number;


    @IsString()
    gender: string;
}