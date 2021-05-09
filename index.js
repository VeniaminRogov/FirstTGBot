const TelegramApi = require('node-telegram-bot-api');

const {gameOption, againOption} = require('./options');

const token = '1894222449:AAHDnO499VoQL9iYKkevcqp24YQrWpbqSCs';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) =>{
	await bot.sendMessage(chatId, 'Сейчас я загадаю число от 1 до 9, а ты должен её отгадать)');
	const randomNumber = Math.floor(Math.random()*10);
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, 'Отгадай число', gameOption);
}

const start = () =>{
	bot.on('message', async msg =>{

		const text = msg.text;
		const chatId = msg.chat.id;


		bot.setMyCommands([
			{command: "/start", description: "Начальное приветствие"},
			{command: "/info", description: "Информация о пользователе"},
			{command: "/game", description: "Игра отгадай число"},
		])

		if (text === '/start'){
			await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/11.webp');
			return bot.sendMessage(chatId,`Добро пожаловать в мой первый телеграмм-бот`);
		}
		if(text === '/info'){
			return bot.sendMessage(chatId,`Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
		}
		if(text === '/game'){
			return startGame(chatId);
		}
		return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');
	})

	bot.on('callback_query', async msg =>{
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if(data === '/again'){
			return startGame(chatId);
		}
		if(data === chats[chatId]){
			return bot.sendMessage(chatId, `Ты отгадал, это число ${chats[chatId]}`, againOption);
		}
		else{
			return bot.sendMessage(chatId, `Ты не отгадал, это число ${chats[chatId]}`, againOption);
		}
	})
}

start();