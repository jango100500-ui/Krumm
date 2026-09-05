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
    <main className="fixed inset-0 w-full bg-[#141416] overflow-hidden">
      
      <div 
        className="absolute left-0 right-0 px-5 z-20 flex justify-start items-center pointer-events-none"
        style={{ top: 'calc(env(safe-area-inset-top, 47px) + 12px)' }}
      >
        <JellyButton
          type="button"
          flashColor="bg-white/10"
          className="w-11 h-11 rounded-full bg-[#1C1C1E]/75 backdrop-blur-[24px] border border-white/10 flex items-center justify-center shadow-sm pointer-events-auto"
        >
          <img
            src="/menu.png"
            alt="Menu"
            className="w-5 h-5 object-contain brightness-0 invert opacity-75 pointer-events-none"
          />
        </JellyButton>
      </div>

      <div 
        className="absolute left-0 right-0 px-5 z-10 flex flex-col pointer-events-none"
        style={{ top: 'calc(env(safe-area-inset-top, 47px) + 85px)' }}
      >
        <div className="w-full max-w-[420px] mx-auto pointer-events-auto">
          <h2 className="text-white text-[20px] font-bold tracking-tight mb-4 px-1">
            Идеи, которые вдохновляют
          </h2>

          <div className="w-full grid grid-cols-2 gap-3">
            {ideas.map((item) => (
              <div
                key={item.id}
                className="w-full h-[126px] rounded-[30px] bg-[#1C1C1E]/75 backdrop-blur-[24px] border border-white/10 p-3.5 flex flex-col justify-between shadow-sm cursor-pointer"
              >
                <div className="w-full flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <img
                      src="/idea.png"
                      alt="Idea"
                      className="w-4 h-4 object-contain brightness-0 invert opacity-90 pointer-events-none"
                    />
                  </div>
                  <span className="text-white text-[13px] font-bold tracking-tight leading-tight mt-1 flex-1">
                    {item.title}
                  </span>
                </div>

                <p className="text-[#8E8E93] text-[11px] font-medium leading-snug tracking-tight">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 px-5 z-30"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 34px) + 16px)' }}
      >
        <div className="w-full max-w-[420px] mx-auto flex items-center gap-2.5">
          
          <div className="flex-1 h-[48px] rounded-full bg-[#1C1C1E]/75 backdrop-blur-[24px] border border-white/10 px-4 flex items-center shadow-sm">
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Давайте планировать…"
              className="w-full bg-transparent text-white placeholder-[#8E8E93] text-[15px] font-medium outline-none border-none tracking-tight"
            />
          </div>

          <JellyButton
            type="button"
            disabled={!hasText}
            flashColor={hasText ? 'bg-black/10' : 'bg-white/10'}
            className={`w-[48px] h-[48px] rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 shadow-sm ${
              hasText
                ? 'bg-[#F9F8F0] border border-transparent'
                : 'bg-[#1C1C1E]/75 backdrop-blur-[24px] border border-white/10'
            }`}
          >
            <img
              src="/send.png"
              alt="Send"
              className={`w-5 h-5 object-contain transition-all duration-300 pointer-events-none ${
                hasText
                  ? 'brightness-0 opacity-90 translate-x-[1px]'
                  : 'brightness-0 invert opacity-40'
              }`}
            />
          </JellyButton>
        </div>
      </div>

    </main>
  );
}
