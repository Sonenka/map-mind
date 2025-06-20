import { Markup } from 'telegraf';
import axios from 'axios';

export function setupAuthetificate(bot) {
    bot.action('AUTHETICATE', async (ctx) => {
        console.log(`${ctx.from?.username || ctx.from?.first_name || 'Аноним'} | AUTHETICATE received`);

        ctx.answerCbQuery();
        await ctx.deleteMessage();

        if (!ctx.session) ctx.session = {};
        ctx.session.authStep = "awaiting_email";

        ctx.reply(
            "Это раздел для авторизации пользователей.\n\nВведите email:",
            Markup.inlineKeyboard([
                [Markup.button.callback('⬅️ Вернуться', 'BACK_TO_MENU')],
            ])
        );
    });

    bot.on("text", async (ctx) => {
        if (ctx.session.authStep === "awaiting_email") {
            const email = ctx.message.text;

            ctx.session.authEmail = email;
            ctx.session.authStep = "awaiting_password";

            await ctx.reply("Теперь введите пароль:");
            return;
        }

        if (ctx.session.authStep === "awaiting_password") {
            const password = ctx.message.text;
            const email = ctx.session.authEmail;

            ctx.session.authStep = null;
            try {
                const currentUser = await axios.post("http://localhost:3000/api/login", {
                    email: email,
                    password: password
                });

                console.log("Авторизация прошла:", currentUser.data);
                ctx.session.user = {
                    id: currentUser.data.id,
                    name: currentUser.data.name,
                    email: currentUser.data.email,
                }
                ctx.reply(
                    "✅ Успешная авторизация!",
                    Markup.inlineKeyboard([
                        [Markup.button.callback('⬅️ В меню', 'BACK_TO_MENU')],
                    ])
                );
            } catch (err) {
                ctx.session.user = null;
                console.error("Ошибка входа:", err.response?.data || err.message);
                ctx.reply(
                    "❌ Ошибка авторизации. Проверьте email и пароль.",
                    Markup.inlineKeyboard([
                        [Markup.button.callback('⬅️ В меню', 'BACK_TO_MENU')],
                    ])
                );
            }
            return;
        }
    });
}
