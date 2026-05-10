import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { enumRole } from "src/common/enums/role.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { ERROR_CODE } from "src/common/messages/error.message";


@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {}


    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const required = this.reflector.getAllAndOverride<enumRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!required) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        
        if ( !required.includes(user.role) ) throw new ForbiddenException( ERROR_CODE.FORBIDDEN() )
        return true
    }
}