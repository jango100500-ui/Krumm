'use client';

import React, { useState, useEffect } from 'react';
import { JellyButton } from '@/components/ui/JellyButton';
import { SearchInput } from '@/components/ui/SearchInput';

export default function Home() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleViewport = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardHeight(offset > 60 ? offset : 0);
    };

    const handleScroll = () => {
      window.scrollTo(0, 0);
    };

    vv.addEventListener('resize', handleViewport);
    vv.addEventListener('scroll', handleViewport);
    window.addEventListener('scroll', handleScroll);

    const preventPinch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchstart', preventPinch, { passive: false });

    return () => {
      vv.removeEventListener('resize', handleViewport);
      vv.removeEventListener('scroll', handleViewport);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', preventPinch);
    };
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
    {
      id: 3,
      title: 'Случайная идея',
      text: 'Это текст идеи, в будущем разраб обязательно нас добавит',
    },
    {
      id: 4,
      title: 'Случайная идея',
      text: 'Это текст идеи, в будущем разраб обязательно нас добавит',
    },
  ];

  return (
    <main className="fixed inset-0 w-full h-[100dvh] bg-[#0a0a0a] overflow-hidden">
      
      <div 
        className="fixed left-0 right-0 px-5 z-20 flex justify-start items-center pointer-events-none"
        style={{ top: 'calc(env(safe-area-inset-top, 44px) + 14px)' }}
      >
        <JellyButton
          type="button"
          flashColor="bg-white/10"
          className="w-11 h-11 rounded-full mt-glass flex items-center justify-center shadow-sm pointer-events-auto"
        >
          <img
            src="/menu.png"
            alt="Menu"
            className="w-5 h-5 object-contain brightness-0 invert opacity-75 pointer-events-none"
          />
        </JellyButton>
      </div>

      <div 
        className="fixed left-1/2 -translate-x-1/2 -translate-y-[56%] w-full max-w-[420px] px-5 z-10 pointer-events-none"
        style={{ top: '50%' }}
      >
        <div className="w-full flex flex-col items-start pointer-events-auto">
          <h2 className="text-white text-[19px] font-bold tracking-tight mb-3 px-1 text-left">
            Идеи, которые вдохновляют
          </h2>

          <div className="w-full grid grid-cols-2 gap-2.5">
            {ideas.map((item) => (
              <div
                key={item.id}
                className="w-full h-[116px] rounded-[24px] mt-glass p-3 flex flex-col justify-between shadow-sm cursor-pointer active:scale-[0.97] transition-transform"
              >
                <div className="w-full flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <img
                      src="/idea.png"
                      alt="Idea"
                      className="w-3.5 h-3.5 object-contain brightness-0 invert opacity-90 pointer-events-none"
                    />
                  </div>
                  <span className="text-white text-[13px] font-bold tracking-tight leading-tight flex-1 text-left">
                    {item.title}
                  </span>
                </div>

                <p className="text-white/50 text-[11px] font-normal leading-snug tracking-tight text-left">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div 
        className="fixed left-0 right-0 px-5 z-30 pointer-events-none transition-[bottom] duration-200 ease-out"
        style={{ 
          bottom: keyboardHeight > 0 
            ? `${keyboardHeight + 8}px` 
            : 'calc(env(safe-area-inset-bottom, 20px) + 8px)'
        }}
      >
        <div className="w-full max-w-[420px] mx-auto pointer-events-auto">
          <SearchInput />
        </div>
      </div>

    </main>
  );
}
