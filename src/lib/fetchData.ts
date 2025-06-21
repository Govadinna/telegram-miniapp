import { supabase } from './supabaseClient';
import type { Event, User } from '@/types';

export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*');

  if (error) {
    console.error('Ошибка получения ивентов:', error.message);
    return [];
  }
  // Type assertion, тк supabase не всегда корректно выводит тип
  return data as Event[] ?? [];
}

interface TgUser {
  id: string | number;
  username?: string;
}

export async function fetchOrCreateUser(tgUser: TgUser): Promise<User | null> {
  const { id, username } = tgUser;

  const { data: existing, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', id)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    // PGRST116 — не найдено, не ошибка
    console.error('Ошибка поиска пользователя:', selectError.message);
  }
  if (existing) return existing as User;

  const { data: createdUser, error: insertError } = await supabase
    .from('users')
    .insert({
      telegram_id: id,
      username,
      balance: 0,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Ошибка создания пользователя:', insertError.message);
    return null;
  }

  return createdUser as User;
}
