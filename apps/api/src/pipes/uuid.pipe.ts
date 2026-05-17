import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { isUUID } from "class-validator";
import { ERROR_CODE } from "src/common/utils/error.utils";


export class pipeValidateUuid implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        
        if (!value || !isUUID(value) ) throw new BadRequestException( ERROR_CODE.BAD_REQUEST('ANY', 'El UUID escrito en la URL no es válido') )

        return value
    }
}