export function useTelegramUser() {
  if (typeof window === 'undefined') return null;
  // @ts-expect-error Нужно для доступа к Telegram WebApp API, нет типов
  return window?.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
}
