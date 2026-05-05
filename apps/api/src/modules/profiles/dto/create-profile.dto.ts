import { IsInt, IsString, Length } from "class-validator";

export class CreateProfileDto {

    @IsInt()
    userIndex: number;

    @IsInt()
    communityIndex: number;

    @IsString()
    @Length(2, 30)
    name: string;
}
