// import express from 'express';
// import bodyParser from 'body-parser';
// import TelegramBot from 'node-telegram-bot-api';
// import { linkUserWithTelegram } from './telegramAuth';

// let bot: TelegramBot | null = null;
// const app = express();
// const port: number = parseInt(process.env.WEB_PORT || '3000', 10);

// export const startBot = async () => {
//   console.log('Starting the bot...');

//   if (!process.env.TELEGRAM_BOT_TOKEN) {
//     console.error('❌ TELEGRAM_BOT_TOKEN is missing in environment variables.');
//     return;
//   }

//   console.log('tokennnnn', process.env.TELEGRAM_BOT_TOKEN);

//   if (!bot) {
//     bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
//       webHook: { port: port },
//     });

//     console.log('✅ Telegram bot started successfully!');
//     console.log('✅ Webhook set up!');

//     const url = 'https://dc58-119-156-115-194.ngrok-free.app/';
//     try {
//       await bot.setWebHook(`${url}/bot${process.env.TELEGRAM_BOT_TOKEN}`);
//       console.log('✅ Webhook successfully set!');
//     } catch (error) {
//       console.error('❌ Error setting the webhook:', error);
//     }

//     app.use(bodyParser.json());

//     app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, async (req, res) => {
//       const msg = req.body.message;
//       if (msg && msg.text) {
//         const chatId = msg.chat.id;
//         console.log('User started the bot:', chatId);

//         if (msg.text === '/start') {
//           bot?.sendMessage(chatId, 'Welcome! Please reply with your phone number (e.g., +923030849043).');

//           bot?.onText(/.+/, async (responseMsg: TelegramBot.Message) => {
//             if (!responseMsg.text) return;

//             const phoneNumber: string = responseMsg.text.trim();
//             const telegramUserId: string = responseMsg.from?.id.toString() ?? '';

//             const phoneRegex = /^\+?\d{10,15}$/;
//             if (!phoneRegex.test(phoneNumber)) {
//               await bot?.sendMessage(chatId, '❌ Invalid phone number format. Please enter a valid number with country code.');
//               return;
//             }

//             if (!telegramUserId) {
//               await bot?.sendMessage(chatId, '⚠️ Error retrieving Telegram ID.');
//               return;
//             }

//             try {
//               const isLinked = await linkUserWithTelegram(phoneNumber, telegramUserId);

//               if (isLinked) {
//                 await bot?.sendMessage(chatId, '✅ Your Telegram ID has been successfully linked to your account.');
//               } else {
//                 await bot?.sendMessage(chatId, '❌ Phone number not found in our system. Please register first.');
//               }
//             } catch (error) {
//               console.error('Error linking user:', error);
//               await bot?.sendMessage(chatId, '⚠️ An error occurred while linking. Please try again later.');
//             }
//           });
//         }
//       }
//       res.sendStatus(200);
//     });

//     app.listen(port, () => {
//       console.log(`Webhook listening on port ${port}`);
//     });
//   }
// };

// export const stopBot = () => {
//   if (bot) {
//     bot.setWebHook('');
//     bot = null;
//     console.log('🚫 Telegram bot stopped!');
//   }
// };
