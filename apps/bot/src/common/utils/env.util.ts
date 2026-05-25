import dontenv from 'dotenv';
import path from 'node:path';
import { ROOT_PATH } from '../constants/path.constant.js';


dontenv.config({ path: path.resolve( ROOT_PATH, '.env') })