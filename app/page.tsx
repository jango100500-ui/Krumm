'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { JellyButton } from '@/components/ui/JellyButton';
import { SearchInput } from '@/components/ui/SearchInput';

export default function Home() {
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [flipAxes, setFlipAxes] = useState<('x' | 'y')[]>(['y', 'y', 'y', 'y']);
  const [flipTrigger, setFlipTrigger] = useState(0);

  useEffect(() => {
    const handleScrollReset = () => {
      window.scrollTo(0, 0);
    };

    const handleViewport = () => {
      window.scrollTo(0, 0);
      if (window.visualViewport) {
        const offset = window.innerHeight - window.visualViewport.height;
        setKeyboardOffset(Math.max(0, offset));
      }
    };

    window.addEventListener('scroll', handleScrollReset);
    window.visualViewport?.addEventListener('resize', handleViewport);
    window.visualViewport?.addEventListener('scroll', handleScrollReset);

    const handleGesture = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchstart', handleGesture, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScrollReset);
      window.visualViewport?.removeEventListener('resize', handleViewport);
      window.visualViewport?.removeEventListener('scroll', handleScrollReset);
      document.removeEventListener('touchstart', handleGesture);
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

  const handleRefreshIdeas = () => {
    setFlipAxes(ideas.map(() => (Math.random() > 0.5 ? 'x' : 'y')));
    setFlipTrigger((prev) => prev + 1);
  };

  return (
    <main className="fixed inset-0 w-full h-[100vh] bg-[#0a0a0a] overflow-hidden">
      
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
          <h2 className="text-white text-[19.6px] font-bold tracking-tight mb-3 px-1 text-left">
            Идеи, которые вдохновляют
          </h2>

          <div className="w-full grid grid-cols-2 gap-2.5 [perspective:1000px]">
            {ideas.map((item, idx) => {
              const axis = flipAxes[idx] || 'y';
              return (
                <motion.div
                  key={item.id}
                  animate={
                    flipTrigger > 0
                      ? axis === 'y'
                        ? { rotateY: [0, 180, 360] }
                        : { rotateX: [0, 180, 360] }
                      : {}
                  }
                  transition={{
                    duration: 0.55,
                    ease: [0.25, 1, 0.5, 1],
                    delay: idx * 0.05,
                  }}
                  className="w-full h-[116px] rounded-[24px] mt-glass p-3 flex flex-col justify-between shadow-sm cursor-pointer active:scale-[0.97] transition-transform"
                >
                  <div className="w-full flex items-center gap-1.5">
                    <img
                      src="/idea.png"
                      alt="Idea"
                      className="w-3.5 h-3.5 object-contain brightness-0 invert opacity-90 shrink-0 pointer-events-none"
                    />
                    <span className="text-white text-[13px] font-bold tracking-tight leading-tight flex-1 text-left truncate">
                      {item.title}
                    </span>
                  </div>

                  <p className="text-white/50 text-[11px] font-normal leading-snug tracking-tight text-left">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="w-full flex justify-end mt-2.5 px-0.5">
            <JellyButton
              type="button"
              onClick={handleRefreshIdeas}
              flashColor="bg-white/10"
              className="h-8 px-3.5 rounded-full mt-glass flex items-center gap-1.5 shadow-sm"
            >
              <img
                src="/refresh.png"
                alt="Refresh"
                className="w-3 h-3 object-contain brightness-0 invert opacity-80 pointer-events-none"
              />
              <span className="text-white/80 text-[12px] font-medium tracking-tight">
                Обновить идеи
              </span>
            </JellyButton>
          </div>
        </div>
      </div>

      <div 
        className="fixed left-0 right-0 px-5 z-30 pointer-events-none transition-[bottom] duration-200"
        style={{ 
          bottom: `${keyboardOffset}px`,
          paddingBottom: 'calc(env(safe-area-inset-bottom, 20px) + 8px)' 
        }}
      >
        <div className="w-full max-w-[420px] mx-auto pointer-events-auto">
          <SearchInput />
        </div>
      </div>

    </main>
  );
}
