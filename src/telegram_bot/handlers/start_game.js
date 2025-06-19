import { Markup } from 'telegraf';
import { setupSinglplayerGame } from './singleplayer.js';
import { setupCheckLeaderboard } from './check_leaderboard.js';


export function setupMenu(bot) {
    bot.command('start', async (ctx) => {
        console.log(`${ctx.from?.username || ctx.from?.first_name || 'Аноним'} | Command /start received`);

        const text = 'Привет, это MapMind!\n\n\
Здесь Вы можете проверить свои знания географии: \
поугадывать столицы, флаги или страны по фото и их контурам.\n\
А полная версия нашего сайта доступна в браузере: http://89.169.142.214:3000\n\n\
Выберите что хотите поделать:';

        return ctx.reply(text, Markup.inlineKeyboard([
            [Markup.button.callback('Одиночная игра', 'SINGLEPLAYER_GAME')],
            [Markup.button.callback('Многопользовательская игра', 'MULTIPLAYER_GAME')],
            [Markup.button.callback('Посмотреть рейтинг пользователей', 'CHECK_LEADERBOARD')],
        ]));
    });

    bot.action('BACK_TO_MENU', async (ctx) => {
        console.log(`${ctx.from?.username || ctx.from?.first_name || 'Аноним'} | BACK_TO_MENU action received`);

        ctx.answerCbQuery();
        await ctx.deleteMessage();
        // await ctx.editMessageReplyMarkup();

        const text = 'Вы вернулись в главное меню. Что хотите сделать?';

        return ctx.reply(text, Markup.inlineKeyboard([
            [Markup.button.callback('Одиночная игра', 'SINGLEPLAYER_GAME')],
            [Markup.button.callback('Многопользовательская игра', 'MULTIPLAYER_GAME')],
            [Markup.button.callback('Посмотреть рейтинг пользователей', 'CHECK_LEADERBOARD')],
        ]));
    });

    bot.action('MULTIPLAYER_GAME', async (ctx) => {
        ctx.answerCbQuery();
        await ctx.deleteMessage();
        // await ctx.editMessageReplyMarkup();
        ctx.reply('Играйте с друзьями на нашем сайте!\nhttp://89.169.142.214:3000', Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ В меню', 'BACK_TO_MENU')],
        ]));
    });

    setupSinglplayerGame(bot);
    setupCheckLeaderboard(bot);
}
