import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { enumClients, enumRole } from "src/common/enums/role.enum";
import { ClientRequest } from "src/common/interfaces/req-client.type";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { Roles } from "src/decorators/roles-user.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        
        const requiredRoles = this.reflector.get(Roles, context.getHandler() )

        if (!requiredRoles) return true;

        console.log(requiredRoles)
        const request = context.switchToHttp().getRequest();
        
        const client: ClientRequest = request.user;

        if (client.type === enumClients.BOT) return true;
        if (!client || !client.role) throw new ForbiddenException( ERROR_CODE.FORBIDDEN('No tienes un rol asignado para validar tu permiso') )

        const hasRole = requiredRoles.includes( client?.role as enumRole );

        if (!hasRole) throw new ForbiddenException( ERROR_CODE.FORBIDDEN('No tienes permiso suficiente con tu rol actual para esta acción') )

        return true
    }
}