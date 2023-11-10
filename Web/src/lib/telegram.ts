import { TELEGRAM_BOT_URL } from "./config";

export function getTelegramConnectURL(idCode: number): string {
  const telegramStartData = {
    idCode: idCode,
  };
  const encodedOptions = encodeURIComponent(
    btoa(JSON.stringify(telegramStartData))
  );
  return `${TELEGRAM_BOT_URL}?start=${encodedOptions}`;
}
