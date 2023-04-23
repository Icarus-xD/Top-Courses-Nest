import { ConfigService } from "@nestjs/config";
import { TelegramOptions } from "src/telegram/telegram.interface";

export const getTelegramConfig = (configService: ConfigService): TelegramOptions => {
  const token = configService.get('TELEGRAM_TOKEN');

  if (!token) {
    throw new Error('TELEGRAM_TOKEN не задан');
  }

  return {
    chatId: configService.get('CHAT_ID') ?? '',
    token: token,
  };
};