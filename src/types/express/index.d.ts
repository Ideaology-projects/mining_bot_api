export {};

declare global {
  namespace Express {
    export interface Request {
      user?: any;
      phoneNumber: string;
    }
  }
}

// declare module "node-telegram-bot-api" {
//   import TelegramBot from "node-telegram-bot-api";
//   export = TelegramBot;
// }
