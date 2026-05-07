import { Injectable } from '@nestjs/common';
import * as fs from "node:fs/promises"
import path from 'node:path';

@Injectable()
export class QuotesService {
  
  async findByIndex(id: number) {


    console.log(id)

  const filePath = path.resolve(__dirname, 'data', 'quotes.json');

  const raw = await fs.readFile(filePath, 'utf-8');

  const json = JSON.parse(raw);

  
  return json[Number(id)];
  }
}
