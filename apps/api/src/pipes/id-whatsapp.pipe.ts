import { ArgumentMetadata, PipeTransform } from "@nestjs/common";



export class pipeParseIdWhatsapp implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        
        return value.split('@')[0]
    }
}