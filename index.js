require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');

const bot = new TelegramApi(process.env.TOKEN, {polling: true});

const session = new Map();

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Start command'},
        {command: '/chain', description: 'Start test chain'}
    ]);
    
    bot.on('text', async msg => {
        const chatId = msg.chat.id;
        const info = session.get(msg.from.id);
        console.log(info);
        
        if(info) {
            const {sess, data} = info;
            
            if(sess === 1) {
                data.push(msg.text);
                session.set(msg.from.id, {sess: 2, data: data});
                await bot.sendMessage(chatId, 'Send second number');
            } else if(sess === 2) {
                data.push(msg.text);
                session.set(msg.from.id, {sess: 3, data: data});
                await bot.sendMessage(chatId, 'Choose the command', {reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{text: '+', callback_data: '+'}, {text: '-', callback_data: '-'}],
                        [{text: '*', callback_data: '*'}, {text: '/', callback_data: '/'}],
                    ]
                })});
            }
        } else {
            if(msg.text === '/start') {
                await bot.sendMessage(chatId, 'Hello there');
            } else if(msg.text === '/chain') {
                session.set(msg.from.id, {sess: 1, data: []});
                await bot.sendMessage(chatId, 'Send first number');
            } else {
                await bot.sendMessage(chatId, 'Didn\'t understand');
            }
        }
    });

    bot.on('callback_query', async msg => {
        const callbackData = msg.data;
        const chatId = msg.message.chat.id;
        console.log(msg);

        const info = session.get(msg.from.id);
        if(info) {
            const {data} = info;
            let answer = 0;
            if(callbackData === '+') {
                answer = +data[0] + +data[1];
            } else if(callbackData === '-') {
                answer = +data[0] - +data[1];
            } else if(callbackData === '*') {
                answer = +data[0] * +data[1];
            } else if(callbackData === '/') {
                answer = +data[0] / +data[1];
            }
            session.delete(msg.from.id);
            await bot.sendMessage(chatId, `This will be: ${answer}`);
        }

    });

    bot.on('voice', async msg => {
        const fileInfo = await bot.getFile(msg.voice.file_id);
        const file = await bot.downloadFile(fileInfo.file_id, './voice');
    });
}

start();