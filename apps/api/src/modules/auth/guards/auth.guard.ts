import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PRIVATE_KEY } from "src/decorators/private.decorator";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {

    constructor(private readonly reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPrivate = this.reflector.getAllAndOverride(IS_PRIVATE_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!isPrivate) return true;
        
        return super.canActivate(context) as boolean;
    }
}