import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
  const secret = process.env.JWT_SECRET ?? 'SPIKE'
  console.log('SECRET USADO PARA VERIFICAR:', secret)
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  })
}

    async validate(payload: any) {
        console.log(payload)
        return {
            sub: payload.sub,
            id: payload.id
        }
    }
}