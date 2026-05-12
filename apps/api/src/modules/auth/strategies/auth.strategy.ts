import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new InternalServerErrorException( 'NO SE HALLA LA SECRET' )

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    })
  }

  async validate(payload: any) {
    
    return {
      index: payload.index,
      role: payload.role
    }
  }
}