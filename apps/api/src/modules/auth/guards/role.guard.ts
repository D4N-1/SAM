import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { enumClients, enumRole } from "src/common/enums/role.enum";
import { ClientRequest } from "src/common/interfaces/req-client.type";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { Public } from "src/decorators/public.decorator";
import { Roles } from "src/decorators/roles-user.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        
        const isPublic = this.reflector.getAllAndOverride(Public, [
            context.getClass(),
            context.getHandler()
        ])

        if (isPublic) return true;
        
        const requiredRoles = this.reflector.getAllAndOverride<enumRole[]>(Roles, [
            context.getClass(),
            context.getHandler()
        ])

        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        
        const client: ClientRequest = request.user;

        if (client?.type === enumClients.BOT) return true;
        if (!client || !client?.role) throw new ForbiddenException( ERROR_CODE.FORBIDDEN('No tienes un rol asignado para validar tu permiso') )

        const hasRole = requiredRoles.includes( client?.role as enumRole );

        if (!hasRole) throw new ForbiddenException( ERROR_CODE.FORBIDDEN(`Necesitas tener permiso de [ ${requiredRoles.join(' - ')} ] para realizar esta acción`) )

        return true
    }
}