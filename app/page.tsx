'use client';

import React, { useState, useRef, useEffect } from 'react';
import { JellyButton } from '@/components/ui/JellyButton';

export default function Home() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const hasText = query.trim().length > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const ideas = [
    {
      id: 1,
      title: 'Случайная идея',
      text: 'Это текст идеи, в будущем разраб обязательно нас добавит',
    },
    {
      id: 2,
      title: 'Случайная идея',
      text: 'Это текст идеи, в будущем разраб обязательно нас добавит',
    },
  ];

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-[#141416] flex flex-col justify-between px-5 pt-3 pb-6">
      <div className="w-full flex justify-start items-center pt-2">
        <JellyButton
          type="button"
          flashColor="bg-white/20"
          className="w-11 h-11 rounded-full bg-white/[0.08] border border-white/[0.14] backdrop-blur-xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
        >
          <img
            src="/menu.png"
            alt="Menu"
            className="w-5 h-5 object-contain brightness-0 invert opacity-80 pointer-events-none"
          />
        </JellyButton>
      </div>

      <div className="w-full max-w-[420px] mx-auto flex flex-col items-start my-auto">
        <h2 className="text-white text-[21px] font-bold tracking-tight mb-4 px-1">
          Идеи, которые вдохновляют
        </h2>

        <div className="w-full grid grid-cols-2 gap-3">
          {ideas.map((item) => (
            <div
              key={item.id}
              className="w-full aspect-square rounded-[26px] bg-white/[0.06] border border-white/[0.12] backdrop-blur-xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <img
                    src="/idea.png"
                    alt="Idea"
                    className="w-4 h-4 object-contain brightness-0 invert opacity-90 pointer-events-none"
                  />
                </div>
                <span className="text-white text-[14px] font-bold tracking-tight leading-tight">
                  {item.title}
                </span>
              </div>

              <p className="text-white/65 text-[12px] font-normal leading-snug tracking-tight">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[420px] mx-auto flex items-center gap-2.5">
        <div className="flex-1 h-12 rounded-full bg-white/[0.08] border border-white/[0.14] backdrop-blur-xl px-5 flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Давайте планировать…"
            className="w-full bg-transparent text-white placeholder-white/40 text-[15px] font-medium outline-none border-none tracking-tight"
          />
        </div>

        <JellyButton
          type="button"
          disabled={!hasText}
          flashColor={hasText ? 'bg-black/15' : 'bg-white/20'}
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] ${
            hasText
              ? 'bg-[#F6F3EB] border-transparent shadow-[0_0_20px_rgba(246,243,235,0.25)]'
              : 'bg-white/[0.08] border-white/[0.14] backdrop-blur-xl opacity-60'
          }`}
        >
          <img
            src="/send.png"
            alt="Send"
            className={`w-5 h-5 object-contain transition-all duration-300 pointer-events-none ${
              hasText
                ? 'brightness-0 opacity-90 translate-x-[1px]'
                : 'brightness-0 invert opacity-60'
            }`}
          />
        </JellyButton>
      </div>
    </main>
  );
}
