import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { QuotesModule } from './modules/quotes/quotes.module';
import { RoleModule } from './modules/roles/roles.module';
import { ContactModule } from './modules/contacts/contact.module';
import { UserModule } from './modules/users/user.module';
import { CommunityModule } from './modules/communities/community.module';
import { GroupModule } from './modules/groups/groups.module';
import { BotsModule } from './modules/bots/bots.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    DbModule, RoleModule, ContactModule,
    UserModule, AuthModule, CommunityModule,
    GroupModule,
    QuotesModule,
    BotsModule,
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
