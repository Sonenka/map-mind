import { Markup } from 'telegraf';
import axios from 'axios';
import { incrementFlagsIdx, shuffleArray } from '../../utils/useful_functions.js';

export function setupFlagsGame(bot) {
    bot.action('FLAGS_GAME', async (ctx) => {
        console.log(`${ctx.from?.username || ctx.from?.first_name || 'Аноним'} | FLAGS_GAME received`);

        ctx.answerCbQuery();
        await ctx.deleteMessage();

        try {
            if (!ctx.session) ctx.session = {};
            if (!ctx.session.flagsQuestions) {
                const res = await axios.get(`http://localhost:3000/api/questions/flags`);
                ctx.session.flagsQuestions = shuffleArray(res.data);
                ctx.session.flagsIdx = 0;
                ctx.session.correctAnswers = 0;
            }

            const text = 'В этой игре вам предстоит угадывать флаги стран.\n\
В каждом вопросе по четыре варианта ответа и только один верный. Удачи!';
            ctx.reply(text, Markup.inlineKeyboard([
                [Markup.button.callback('Начать игру', `NEXT_FLAGS_QUESTION|${0}|${0}`)],
                [Markup.button.callback('⬅️ Вернуться', 'BACK_TO_MENU')],
            ]));
        } catch (err) {
            console.error(err);
            ctx.reply('Ошибка одиночной игры.', Markup.inlineKeyboard([
                [Markup.button.callback('⬅️ Вернуться', 'BACK_TO_MENU')],
            ]));
        }
    });

    bot.action(/NEXT_FLAGS_QUESTION\|(\d+)\|(0|1)/, async (ctx) => {
        ctx.answerCbQuery();
        await ctx.editMessageReplyMarkup();

        const match = ctx.match;
        const questionNumer = parseInt(match[1]);
        const correct = parseInt(match[2]);

        var text = '';

        if (questionNumer > 0) {
            if (correct == 1) {
                ctx.session.correctAnswers++;
                console.log(`${ctx.from?.username || ctx.from?.first_name || 'Аноним'} | ✅ Правильно!`, ctx.session.correctAnswers, questionNumer);
                text += '✅ Правильно!\n\n';
            } else {
                console.log(`${ctx.from?.username || ctx.from?.first_name || 'Аноним'} | ❌ Неправильно!`, ctx.session.correctAnswers, questionNumer);
                text += '❌ Неправильно!\n\n';
            }
        }

        if (questionNumer + 1 <= 10) {
            const currentQuestion = ctx.session.flagsQuestions[ctx.session.flagsIdx];
            incrementFlagsIdx(ctx);
            text += currentQuestion.question + '?';

            const flags = convertSvgToPngLinks(currentQuestion.options);

            const media = flags.map((url) => ({
                type: 'photo',
                media: url
            }));

            const optionButtons = currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.correct ? 1 : 0;
                return [Markup.button.callback(index + 1, `NEXT_FLAGS_QUESTION|${questionNumer + 1}|${isCorrect}`)]
            });

            const controlButtons = [
                [Markup.button.callback('❌ Завершить игру', 'BACK_TO_MENU')]
            ];
            const keyboard = [...optionButtons, ...controlButtons];
            await ctx.replyWithMediaGroup(media);
            await ctx.reply(text, Markup.inlineKeyboard(keyboard));
        } else {
            text += '🏆 Игра завершена!\n';
            text += 'Вы ответили правильно на ' + ctx.session.correctAnswers + ' из 10 вопросов!';
            ctx.reply(text, Markup.inlineKeyboard([
                [Markup.button.callback('⬅️ В меню', 'BACK_TO_MENU')],
            ]));
        }
    });

    function convertSvgToPngLinks(svgLinks) {
        return svgLinks.map(link => {
            const codeMatch = link.match(/\/([a-z]{2})\.svg$/i);
            if (!codeMatch) return null;

            const countryCode = codeMatch[1];
            return `https://flagcdn.com/w320/${countryCode}.png`; // 320px версия
        }).filter(Boolean);
    }
}
