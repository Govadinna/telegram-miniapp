export function useTelegramUser() {
  if (typeof window === 'undefined') return null;
  // @ts-expect-error
  return window?.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
}
