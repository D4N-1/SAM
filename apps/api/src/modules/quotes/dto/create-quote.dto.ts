import { IsArray, IsString } from "class-validator";

export class CreateQuoteDto {

    @IsString()
    content: string;

    @IsString()
    Author: string;

    @IsString()
    from: string;

    @IsArray()
    tags: any[]
}
