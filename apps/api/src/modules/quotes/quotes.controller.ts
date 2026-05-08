import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}


  @Get()
  async random() {

    return this.quotesService.random()
  }

}
