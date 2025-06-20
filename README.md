# 🧠 MapMind

**MapMind** — это интерактивное веб-приложение и Telegram-бот, предназначенные для увлекательного изучения географии. Пользователи могут угадывать столицы, флаги стран, определять страны по фотографиям и по положению на карте. Игра ориентирована на обучение через игру, а также предоставляет рейтинговую систему для мотивации.

Cайт доступен по адресу [https://mapmind.ru](https://mapmind.ru)

---

## 🚀 Основные возможности

### 🧩 Игровые режимы
- **Столицы стран** — выбери правильную столицу среди 4 вариантов
- **Флаги** — угадай страну по флагу
- **Страна по фото** — определи страну по известному фото
- **Страна по контуру** — выбери страну по её очертанию

### 🤖 Telegram-бот
- Поддержка команд: `/start`
- Интерактивные inline-кнопки и меню
- Поддержка одиночной игры и просмотр рейтинга

### 🏆 Лидерборд
- Автоматическое сохранение и подсчёт очков
- Вывод топ-игроков с медалями (🥇🥈🥉)

---

## 📦 Используемые технологии

| Часть              | Технология         |
|--------------------|--------------------|
| Фронтенд           | Next.js 15, React 18 |
| Бэкенд/API         | Next.js API Routes |
| Бот                | Telegraf (Node.js) |
| Запросы            | Axios              |
| Хранение данных    | Prisma / JSON      |
| Деплой и сервер    | Node.js + Nginx    |

---

## 🛠 Установка и запуск локально

1. **Клонируй репозиторий:**
```bash
git clone https://github.com/Sonenka/map-mind.git
cd map-mind
```

2. **Установи зависимости:**
```bash
npm install
```

3. **Запусти dev-сервер:**
```bash
npm run dev
```

4. **Сборка и запуск в продакшн:**
```bash
npm run build
npm start
```

---

## 🤖 [Telegram-бот](https://t.me/map_mind_bot)



📂 Файл: `src/telegram_bot/bot.js`

1. Установи зависимости:
```bash
npm install telegraf axios dotenv
```

2. Создай `.env` файл:
```env
BOT_TOKEN=your_telegram_bot_token_here
```

3. Запусти бота:
```bash
node src/telegram_bot/bot.js
```

Бот умеет:
- Отправлять картинки и вопросы
- Обрабатывать ответы пользователей
- Работать с API сервера

---

## 🌍 Деплой на сервер с доменом

1. Установи **Node.js**, **PM2**, и **Nginx** на сервере (Ubuntu)
2. Прокинь порт 3000 через Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Установи SSL:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Теперь сайт доступен по адресу `https://yourdomain.com`

---

## 📁 Структура проекта

```
src/
├── app/                 # Next.js страницы и API endpoints
├── components/          # React-компоненты UI
├── lib/                 # Вспомогательные модули (например, prisma)
├── telegram_bot/
│   ├── bot.js           # Telegram-бот Telegraf
│   └── handlers/        # Обработчики игровых режимов
```

---

## 👥 Авторы

- [@Sonenka](https://github.com/Sonenka)
- [@Kaparya](https://github.com/Kaparya)
- [@PiginIvan](https://github.com/PiginIvan)
- [@GorylevIvan](https://github.com/GorylevIvan)

