import { Reflector } from "@nestjs/core";
import { enumRole } from "src/common/enums/role.enum";

/**
 * Decorador que grabará los ROLES permitidos, ver `enumROLES`
 */
export const Roles = Reflector.createDecorator<enumRole[]>()