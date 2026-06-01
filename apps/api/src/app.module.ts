import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-ioredis-yet'
import { TerminusModule } from '@nestjs/terminus'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { QuotesModule } from './modules/quotes/quotes.module';
import { RoleModule } from './modules/roles/role.module';
import { ContactModule } from './modules/contacts/contact.module';
import { UserModule } from './modules/users/user.module';
import { CommunityModule } from './modules/communities/community.module';
import { GroupModule } from './modules/groups/group.module';
import { BotModule } from './modules/bots/bot.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './modules/auth/guards/jwt.guard';
import { RolesGuard } from './modules/auth/guards/role.guard';
import { RealmModule } from './modules/realms/realm.module';
import { CommandModule } from './modules/commands/commands.module';

@Module({
  imports: [

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async() => ({
        ttl: 10 * 60_000,
        store: await redisStore ({
          host: '127.0.0.1',
          port: 6379,
          ttl: 10 * 60_000
        })
      })
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TerminusModule, HttpModule,

    DatabaseModule, RoleModule, ContactModule,
    UserModule, AuthModule, CommunityModule,
    GroupModule, BotModule, RealmModule,
    QuotesModule,
    CommandModule,
     ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: JwtGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
  }
}
