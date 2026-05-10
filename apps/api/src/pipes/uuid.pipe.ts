import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { isUUID } from "class-validator";
import { ERROR_CODE } from "src/common/messages/error.message";


export class pipeValidateUuid implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        
        console.log(value)

        if (!isUUID(value) ) throw new BadRequestException( ERROR_CODE.BAD_REQUEST() )

        return value
    }
}