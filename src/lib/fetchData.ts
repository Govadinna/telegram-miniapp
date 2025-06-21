import { supabase } from './supabaseClient';

export async function fetchEvents() {
  const { data, error } = await supabase.from('events').select('*');
  if (error) {
    console.error('Ошибка получения ивентов:', error.message);
    return [];
  }
  return data;
}

export async function fetchOrCreateUser(tgUser: any) {
  const { id, username } = tgUser;

  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', id)
    .single();

  if (existing) return existing;

  const { data: createdUser } = await supabase
    .from('users')
    .insert({
      telegram_id: id,
      username,
      balance: 0,
    })
    .select()
    .single();

  return createdUser;
}


