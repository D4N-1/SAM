import { Injectable } from '@nestjs/common';
import * as fs from "node:fs/promises"
import path from 'node:path';

@Injectable()
export class QuotesService {
  
  async random() {

    const filePath = path.resolve(__dirname, 'data', 'quotes.json');

    const raw = await fs.readFile(filePath, 'utf-8');

    const json = JSON.parse(raw);

    const max = json.length
  
    return json[Math.floor( Math.random() * max )];
  }
}
