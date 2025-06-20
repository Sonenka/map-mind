import { Markup } from 'telegraf';
import { setupCapitalsGame } from './single_games/capitals_game.ts';
import { setupFlagsGame } from './single_games/flags_game.ts';
import { setupCountryPhotoGame } from './single_games/country_photo_game.ts';
import { setupCountryMapGame } from './single_games/country_map_game.ts';

export function setupSinglplayerGame(bot) {
    bot.action('SINGLEPLAYER_GAME', async (ctx) => {
        console.log(`${ctx.from?.username || ctx.from?.first_name || 'Аноним'} | SINGLEPLAYER_GAME received`);

        ctx.answerCbQuery();
        await ctx.deleteMessage();

        const text = 'Вы запустили одиночную игру!\n\n\
Выберите что хотите угадывать:';
        ctx.reply(text, Markup.inlineKeyboard([
            [Markup.button.callback('🏛️ Столицы стран', 'CAPITALS_GAME')],
            [Markup.button.callback('🇷🇺 Флаги стран', 'FLAGS_GAME')],
            [Markup.button.callback('🖼️ Страну по фото', 'COUNTRY_PHOTO_GAME')],
            [Markup.button.callback('🗾 Страну по карте', 'COUNTRY_MAP_GAME')],
            [Markup.button.callback('⬅️ Вернуться', 'BACK_TO_MENU')],
        ]));
    });

    setupCapitalsGame(bot);
    setupFlagsGame(bot);
    setupCountryPhotoGame(bot);
    setupCountryMapGame(bot);
}
