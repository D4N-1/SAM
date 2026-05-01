import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';


JwtModule.register({
  secret: 'SPIKE',
  signOptions: { expiresIn: '8h' }
})

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
