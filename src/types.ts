export type Event = {
  id: string;
  title: string;
  image_url: string;
  description: string;
  prize: string;
  tag1: string;
  tag2: string;
  tag3: string;
  is_active: boolean; // <- добавь сюда
};


export type User = {
  id: string;
  telegram_id: string;
  username: string;
  balance: number;
};
