import { ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { ClsService } from "nestjs-cls";
import { enumClients } from "src/common/enums/role.enum";
import { ClientRequest } from "src/common/interfaces/req-client.type";
import { ERROR_CODE } from "src/common/utils/error.utils";
import { Private } from "src/decorators/private.decorator";
import { Public } from "src/decorators/public.decorator";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {

    constructor(
        private readonly cls: ClsService,
        private readonly reflector: Reflector
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride(Public, [
            context.getHandler(),
            context.getClass()
        ])

        if (isPublic) return true;

        const isPrivate = this.reflector.getAllAndOverride(Private, [
            context.getHandler(),
            context.getClass()
        ])


        if (!isPrivate) return true;

        const canActivate = await super.canActivate(context);

        if (!canActivate) return false;

        const request = context.switchToHttp().getRequest();
        const client: ClientRequest = request.user;

        if (client) {
            this.cls.set('userType', client.type);
            this.cls.set('userId', client.uuid); // Basado en tu payload que usa uuid
        }

        return canActivate as boolean
    }
}