import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class pipeValidateNumber implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {

        const number = Number( value.age )

        if ( isNaN(number) ) throw new BadRequestException('Edad debe ser un numero')

        return {...value, age: number }
    }
}