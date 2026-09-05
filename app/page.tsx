'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { JellyButton } from '@/components/ui/JellyButton';
import { SearchInput } from '@/components/ui/SearchInput';

export default function Home() {
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isInputActive, setIsInputActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleScrollReset = () => {
      window.scrollTo(0, 0);
    };

    const handleViewport = () => {
      window.scrollTo(0, 0);
      if (window.visualViewport) {
        const vv = window.visualViewport;
        const offset = window.innerHeight - (vv.height + vv.offsetTop);
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
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 240);
  };

  const isKeyboardOpen = keyboardOffset > 30;

  return (
    <main className="fixed inset-0 w-full h-[100vh] bg-[#0a0a0a] overflow-hidden">
      
      {isInputActive && (
        <div
          onClick={() => {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }}
          className="fixed inset-0 z-15 bg-black/40 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
        />
      )}

      <div 
        className={`fixed left-0 right-0 px-5 z-20 flex justify-start items-center pointer-events-none transition-all duration-300 ${
          isInputActive ? 'opacity-30 blur-[4px]' : 'opacity-100 blur-none'
        }`}
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
        className={`fixed left-1/2 -translate-x-1/2 -translate-y-[56%] w-full max-w-[420px] px-5 z-10 pointer-events-none transition-all duration-300 ${
          isInputActive ? 'opacity-30 blur-[8px]' : 'opacity-100 blur-none'
        }`}
        style={{ top: '50%' }}
      >
        <div className="w-full flex flex-col items-start pointer-events-auto">
          <h2 className="text-white text-[19.6px] font-bold tracking-tight mb-3 px-1 text-left">
            Идеи, которые вдохновляют
          </h2>

          <div className="w-full grid grid-cols-2 gap-2.5">
            {ideas.map((item) => (
              <div
                key={item.id}
                className="w-full h-[116px] rounded-[24px] mt-glass p-3 flex flex-col justify-between shadow-sm cursor-pointer active:scale-[0.97] transition-transform"
              >
                <motion.div
                  animate={{
                    filter: isRefreshing ? 'blur(8px)' : 'blur(0px)',
                    opacity: isRefreshing ? 0.15 : 1,
                    scale: isRefreshing ? 0.98 : 1,
                  }}
                  transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full h-full flex flex-col justify-between"
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
              </div>
            ))}
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
        className="fixed left-0 right-0 px-5 z-30 pointer-events-none transition-[bottom] duration-150 ease-out"
        style={{ 
          bottom: isKeyboardOpen 
            ? `${keyboardOffset + 8}px` 
            : 'calc(env(safe-area-inset-bottom, 20px) + 8px)'
        }}
      >
        <div className="w-full max-w-[420px] mx-auto pointer-events-auto">
          <SearchInput onFocusChange={setIsInputActive} />
        </div>
      </div>

    </main>
  );
}
