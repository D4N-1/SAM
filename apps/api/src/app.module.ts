import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TerminusModule, HttpModule,

    DatabaseModule, RoleModule, ContactModule,
    UserModule, AuthModule, CommunityModule,
    GroupModule, BotModule,
    QuotesModule,
     ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
  }
}
