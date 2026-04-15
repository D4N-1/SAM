import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { genderModule } from './genders/gender.module';
import { DbModule } from './database/database.module';

@Module({
  imports: [DbModule, genderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
