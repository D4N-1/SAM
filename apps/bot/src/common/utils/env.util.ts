import dontenv from 'dotenv';
import { BOT_PATH } from './bot-path.util.js';
import path from 'node:path';


dontenv.config({ path: path.resolve( BOT_PATH, '.env') })