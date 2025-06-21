export function useTelegramUser() {
  if (typeof window === 'undefined') return null;
  // @ts-ignore
  return window?.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
}
