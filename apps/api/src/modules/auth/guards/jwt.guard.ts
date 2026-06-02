import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Private } from "src/decorators/private.decorator";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {

    constructor(private readonly reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPrivate = this.reflector.getAllAndOverride(Private, [
            context.getHandler(),
            context.getClass()
        ])

        if (!isPrivate) return true;
        
        const canActivate = await super.canActivate(context);
        return canActivate as boolean
    }
}