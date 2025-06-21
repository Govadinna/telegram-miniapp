'use client';

import { useEffect, useState } from 'react';
import { useTelegramUser } from '@/lib/useTelegramUser';
import { fetchOrCreateUser, fetchEvents } from '@/lib/fetchData';
import { Event, User } from '@/types';
import Image from 'next/image';

export default function Home() {
  const tgUser = useTelegramUser();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
  console.log('tgUser:', tgUser);
  if (!tgUser) return;

  (async () => {
    try {
      const userData = await fetchOrCreateUser(tgUser);
      console.log('User data:', userData);
      setUser(userData);

      const eventList = await fetchEvents();
      console.log('Event list:', eventList);
      setEvents(eventList);
    } catch (error) {
      console.error('Ошибка авторизации/регистрации:', error);
    }
  })();
}, [tgUser]);
  

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex justify-between items-center px-6 mt-6">
        <h1 className="text-4xl font-extrabold">Главная</h1>
        {user && (
          <div className="text-white px-4 py-2 rounded-full text-sm font-semibold">
            Баланс: {user.balance}💰
          </div>
        )}
      </div>

      <h2 className="text-2xl font-extrabold mt-6 ml-6">Активные ивенты</h2>

      <div className="flex overflow-x-auto scroll-smooth gap-x-4 mt-4 px-6 pb-4 hide-scrollbar">
        {events.map((event) => (
          <div key={event.id} className="flex-shrink-0 w-[385px]">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <div>
      {event.is_active ? (
        <h3 className="mt-2 text-xs ml-0 font-semibold text-blue-500">АКТИВНО</h3>
      ) : (
        <h3 className="mt-2 text-xs ml-0 font-semibold text-red-500">ЗАВЕРШЕНО</h3>
      )}

      <div className="mt-2 aspect-video relative overflow-hidden rounded-t-lg">
        {/* Размытое заднее изображение */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            style={{ objectFit: 'cover', filter: 'blur(12px)' }}
            sizes="(max-width: 768px) 100vw, 385px"
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 0%, black 50%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
            }}
          />
        </div>

        {/* Основное изображение */}
        <div className="absolute inset-0">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            style={{
              objectFit: 'cover',
              WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 80%)',
              maskImage: 'linear-gradient(to bottom, black 30%, transparent 75%)',
            }}
            sizes="(max-width: 768px) 100vw, 385px"
          />
        </div>

        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <h2 className="text-3xl font-extrabold text-white">{event.title}</h2>
        </div>
      </div>

      <div className="bg-neutral-800 rounded-b-lg px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{event.description}</h3>
          <p className="text-sm text-white/70 mr-2">{event.prize}</p>
        </div>
        <div className="flex flex-col items-center">
          <button className="bg-gray-700 hover:bg-gray-600 text-blue-600 text-sm font-semibold px-3 py-2 rounded-[30px]">
            Смотреть
          </button>
          <span className="text-xs text-white/50 mt-[1px]">Бесплатно</span>
        </div>
      </div>
    </div>
  );
}
