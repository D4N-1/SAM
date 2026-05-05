import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { CommunitiesModule } from './modules/communities/communities.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './modules/profiles/entities/profile.entity';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    DbModule, UsersModule,
    CommunitiesModule, ProfilesModule,
    AuthModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
