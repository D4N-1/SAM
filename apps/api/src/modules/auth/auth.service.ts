import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { ERROR_CODE } from 'src/common/messages/error.message';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService) {}

    async signIn(userUuid: string, password: string) {

      const user = await this.userService.getByUuid(userUuid)
      if (!user) throw new NotFoundException( ERROR_CODE.NOT_FOUND() )

      if (password !== user.passwordHash) throw new UnauthorizedException( ERROR_CODE.UNAUTHORIZED() )

      return {
        uuid: user.uuid,
        password: user.passwordHash
      }
    }
}
