import { Reflector } from "@nestjs/core";

/**
 * Decorador que indica que la petición debe ser por alguien logueado
 */
export const Private = Reflector.createDecorator<boolean>();