import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AuthenticatedRequest } from "src/common/types/req-user.type";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { Roles } from "src/decorators/roles-user.decorator";


export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        
        const requiredRoles = this.reflector.get(Roles, context.getHandler() )

        if (!requiredRoles) return true

        const request = context.switchToHttp().getRequest();
        const user: AuthenticatedRequest = request.user;

        if (!user || !user.role) throw new ForbiddenException( ERROR_CODE.FORBIDDEN('No tienes un rol asignado para validar tu permiso') )

        const hasRole = requiredRoles.includes( user.role );

        if (!hasRole) throw new ForbiddenException( ERROR_CODE.FORBIDDEN('No tienes permiso suficiente con tu rol actual para esta acción') )

        return true
    }
}