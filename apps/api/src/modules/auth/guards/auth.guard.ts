import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CODE_ERRORS } from "src/common/messages/error.message";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user) throw err || new UnauthorizedException( CODE_ERRORS.UNAUTHORIZED() );
    
        return user;
    }
}