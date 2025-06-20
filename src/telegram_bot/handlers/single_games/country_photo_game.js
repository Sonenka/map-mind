import { Markup } from 'telegraf';
import axios from 'axios';
import { incrementCountryPhotoIdx, shuffleArray } from '../../utils/useful_functions.js';

export function setupCountryPhotoGame(bot) {
    bot.action('COUNTRY_PHOTO_GAME', async (ctx) => {
        console.log(`${ctx.from?.username || ctx.from?.first_name || 'Аноним'} | COUNTRY_PHOTO_GAME received`);

        ctx.answerCbQuery();
        await ctx.deleteMessage();

        try {
            if (!ctx.session) ctx.session = {};
            if (!ctx.session.countryPhotoQuestions) {
                const res = await axios.get(`http://localhost:3000/api/questions/photos`);
                ctx.session.countryPhotoQuestions = shuffleArray(res.data);
                ctx.session.countryPhotoIdx = 0;
                ctx.session.correctAnswers = 0;
            }

            const text = 'В этой игре вам предстоит угадывать страны по фото.\n\
В каждом вопросе по четыре варианта ответа и только один верный. Удачи!';
            ctx.reply(text, Markup.inlineKeyboard([
                [Markup.button.callback('Начать игру', `NEXT_COUNTRY_PHOTO_QUESTION|${0}|${0}`)],
                [Markup.button.callback('⬅️ Вернуться', 'BACK_TO_MENU')],
            ]));
        } catch (err) {
            console.error(err);
            ctx.reply('Ошибка одиночной игры.', Markup.inlineKeyboard([
                [Markup.button.callback('⬅️ Вернуться', 'BACK_TO_MENU')],
            ]));
        }
    });

    bot.action(/NEXT_COUNTRY_PHOTO_QUESTION\|(\d+)\|(0|1)/, async (ctx) => {
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

        if (questionNumer + 1 <= 5) {
            const currentQuestion = ctx.session.countryPhotoQuestions[ctx.session.countryPhotoIdx];
            incrementCountryPhotoIdx(ctx);
            text += 'Это фото из какой страны?';

            const optionButtons = currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.correct ? 1 : 0;
                return [Markup.button.callback(option, `NEXT_COUNTRY_PHOTO_QUESTION|${questionNumer + 1}|${isCorrect}`)]
            });

            const controlButtons = [
                [Markup.button.callback('❌ Завершить игру', 'BACK_TO_MENU')]
            ];
            const keyboard = [...optionButtons, ...controlButtons];

            await ctx.replyWithPhoto(currentQuestion.question, { caption: '' });
            await ctx.reply(text, Markup.inlineKeyboard(keyboard));
        } else {
            if (ctx.session.user) {
                const response = await axios.post(
                    'http://localhost:3000/api/result',
                    {
                        score: ctx.session.correctAnswers,
                        currentUserId: ctx.session.user.id,
                        currentUserEmail: ctx.session.user.email,
                    },
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                );
                console.log(`${ctx.from?.username || ctx.from?.first_name || 'Аноним'} | Ответ от сервера:`, response.data?.score || -1);
            }

            text += '🏆 Игра завершена!\n';
            text += 'Вы ответили правильно на ' + ctx.session.correctAnswers + ' из 5 вопросов!';
            ctx.session.correctAnswers = 0;
            ctx.reply(text, Markup.inlineKeyboard([
                [Markup.button.callback('⬅️ В меню', 'BACK_TO_MENU')],
            ]));
        }
    });
}
