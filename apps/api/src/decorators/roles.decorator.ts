import { SetMetadata } from "@nestjs/common"
import { enumRole } from "src/common/enums/role.enum"

export const ROLES_KEY = 'roles'

export const Roles = (...roles: enumRole[]) => SetMetadata(ROLES_KEY, roles)