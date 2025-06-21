// lib/fetchData.ts
import { supabase } from './supabaseClient';
import type { Event, User } from '@/types';

export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase.from('events').select('*');
  if (error) {
    console.error('Ошибка получения ивентов:', error.message);
    return [];
  }
  console.log('Полученные ивенты из БД:', data);
  return data as Event[] ?? [];
}

// tgUser может быть null — если не из Telegram — тогда используем тестового
export async function fetchOrCreateUser(tgUser: { id: number | string; username?: string } | null) {
  // Тестовый пользователь, если tgUser нет
  const TEST_USER = {
    id: '999999999',
    username: 'test_user',
  };

  const userToUse = tgUser ?? TEST_USER;

  // Важно: всегда приводим к строке, чтобы тип совпадал с типом в БД
  const telegram_id = userToUse.id.toString();
  const username = userToUse.username ?? '';

  console.log('Ищем пользователя с telegram_id:', telegram_id);

  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegram_id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error('Ошибка при поиске пользователя: ' + fetchError.message);
  }

  if (existingUser) return existingUser;

  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert({ telegram_id, username, balance: 0 })
    .select()
    .single();

  if (createError) throw new Error('Ошибка при создании пользователя: ' + createError.message);

  return newUser;
}
