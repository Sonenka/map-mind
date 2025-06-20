import { Markup } from 'telegraf';
import axios from 'axios';

export function setupCheckLeaderboard(bot) {
    bot.action('CHECK_LEADERBOARD', async (ctx) => {
        console.log(`${ctx.from?.username || ctx.from?.first_name || 'Аноним'} | CHECK_LEADERBOARD received`);

        ctx.answerCbQuery();
        await ctx.deleteMessage();
        // await ctx.editMessageReplyMarkup();

        try {
            const res = await axios.get(`http://localhost:3000/api/leaderboard`);
            const leaderboard = res.data;

            const medals = ['🥇', '🥈', '🥉'];
            const text = leaderboard.slice(0, 7)
                .map((user, index) => {
                    const prefix = medals[index] || ` ${index + 1}. `;
                    return `${prefix} ${user.name} — ${user.totalScore}`;
                })
                .join('\n');
            ctx.reply('Рейтинг пользователей:\n\n' + text, Markup.inlineKeyboard([
                [Markup.button.callback('⬅️ Вернуться', 'BACK_TO_MENU')],
            ]));
        } catch (err) {
            console.error(err);
            ctx.reply('Ошибка получения рейтинга.', Markup.inlineKeyboard([
                [Markup.button.callback('<= Вернуться', 'BACK_TO_MENU')],
            ]));
        }
    });
}