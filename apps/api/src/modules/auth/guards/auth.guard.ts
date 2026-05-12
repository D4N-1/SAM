import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ERROR_CODE } from "src/common/messages/error.message";
import { IS_PRIVATE_KEY } from "src/decorators/private.decorator";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPrivate = this.reflector.getAllAndOverride(IS_PRIVATE_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!isPrivate) return true;
        
        const request = context.switchToHttp().getRequest()
        const token = await this.extractTokenFromHeader(request)

        if (!token) throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED() )

        try {

            const payload = await this.jwtService.verifyAsync(token);

            request['user'] = payload;

        } catch (error) {
            throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED() )
        }
        
        return true
    }

    async extractTokenFromHeader(request: Request): Promise<string | undefined> {
        const [ type, token ] = request.headers?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined
    }
}