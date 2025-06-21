// lib/useTelegramUser.ts
export function useTelegramUser() {
  if (typeof window === 'undefined') return null;

  // @ts-expect-error: TS не знает про Telegram WebApp
  const user = window?.Telegram?.WebApp?.initDataUnsafe?.user ?? null;

  return user;
}
