import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommunityDto {

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;
}
