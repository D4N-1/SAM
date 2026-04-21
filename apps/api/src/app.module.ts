import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GendersModule } from './genders/genders.module';
import { DbModule } from './database/database.module';
import { AnimeModule } from './animes/animes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    DbModule, GendersModule, AnimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
