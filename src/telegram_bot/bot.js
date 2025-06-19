import { Telegraf, session } from 'telegraf';
import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

import { setupMenu } from './handlers/start_game.js';

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

setupMenu(bot);

bot.launch();