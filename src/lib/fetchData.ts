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

export async function fetchOrCreateUser(tgUser: { id: number | string; username?: string }) {
  const telegram_id = tgUser.id.toString();
  const username = tgUser.username ?? '';

  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegram_id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error('Ошибка при поиске пользователя: ' + fetchError.message);
  }
  console.log('Найденный пользователь:', existingUser);

  if (existingUser) return existingUser;

  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert({ telegram_id, username, balance: 0 })
    .select()
    .single();

  if (createError) throw new Error('Ошибка при создании пользователя: ' + createError.message);

  console.log('Создан новый пользователь:', newUser);
  return newUser;
}
