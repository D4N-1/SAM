import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BotModule } from '../bots/bot.module';
import { ClsModule } from 'nestjs-cls';
import { BotSocketModule } from '../bot-socket/bot-socket.module';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.getOrThrow<'string'|number|any>('EXPIRES_IN') }
      })
    }),
    UserModule, BotModule, ClsModule,
    forwardRef( () => BotSocketModule )
  ],
  controllers: [AuthController],
  providers: [ AuthService, JwtStrategy ],
  exports: [ AuthService ]
})
export class AuthModule {}
