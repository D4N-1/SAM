import { IsString } from "class-validator";

export class CreateAuthDto {

    @IsString()
    id: string;

    @IsString()
    password: string;
}
