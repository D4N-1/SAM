import { Reflector } from "@nestjs/core";


/**
 * Indica que la petición puede ser pedida por cualquier cliente (incluyendo invitados)
 */
export const Public = Reflector.createDecorator<boolean>();