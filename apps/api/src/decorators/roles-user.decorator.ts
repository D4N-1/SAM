import { Reflector } from "@nestjs/core";
import { enumRole } from "src/common/enums/role.enum";

export const Roles = Reflector.createDecorator<enumRole[]>()