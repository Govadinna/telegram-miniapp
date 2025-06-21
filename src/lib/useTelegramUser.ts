export function useTelegramUser() {
  if (typeof window === 'undefined') return null;

  // Получаем пользователя из Telegram WebApp (если открыт в миниприложении)
  // @ts-expect-error: потому что TS не знает про Telegram WebApp
  const user = window?.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
  
  return user;
}
