import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { ERROR_CODE } from 'src/common/messages/error.message';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

    async signIn(userUid: string, password: string): Promise<{ access_token: string }> {

      const user = await this.userService.findByUid(userUid)
      if (!user) throw new NotFoundException( ERROR_CODE.NOT_FOUND() )

      if (password !== user.passwordHash) throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED() )

      const payload = {
        uuid: user.uuid,
        name: user.name
      }

      return {
        access_token: await this.jwtService.signAsync(payload)
      }
    }
}
