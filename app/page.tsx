'use client';

import React, { useState, useEffect, useRef } from 'react';
import { JellyButton } from '@/components/ui/JellyButton';
import { SearchInput } from '@/components/ui/SearchInput';

export default function Home() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isInputActive, setIsInputActive] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const measureKeyboard = () => {
    const vv = window.visualViewport;
    if (!vv) return;
    const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    setKeyboardHeight(offset > 60 ? offset : 0);
  };

  const startPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    let count = 0;
    pollingRef.current = setInterval(() => {
      measureKeyboard();
      count++;
      if (count > 25) {
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    }, 20);
  };

  const handleInputFocus = () => {
    setIsInputActive(true);
    startPolling();
  };

  const handleInputBlur = () => {
    setIsInputActive(false);
    startPolling();
  };

  const handleDismiss = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  useEffect(() => {
    const resetFocusState = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      setIsInputActive(false);
      setKeyboardHeight(0);
    };

    resetFocusState();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        resetFocusState();
      }
    };

    window.addEventListener('pageshow', resetFocusState);
    document.addEventListener('visibilitychange', handleVisibility);

    const vv = window.visualViewport;
    if (!vv) return;

    const handleViewport = () => {
      measureKeyboard();
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
      window.removeEventListener('pageshow', resetFocusState);
      document.removeEventListener('visibilitychange', handleVisibility);
      vv.removeEventListener('resize', handleViewport);
      vv.removeEventListener('scroll', handleViewport);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', preventPinch);
      if (pollingRef.current) clearInterval(pollingRef.current);
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

  const isBlurred = isInputActive || keyboardHeight > 0;

  return (
    <main className="fixed inset-0 w-full h-[100dvh] bg-[#0a0a0a] overflow-hidden">
      
      <div 
        className="absolute inset-x-0 bottom-0 bg-[#18181A] pointer-events-none z-0"
        style={{ top: 'calc(50% - 165px)' }}
      >
        <img
          src="/clouds.png"
          alt="Clouds"
          className="absolute bottom-full left-0 w-full h-auto object-cover pointer-events-none block"
        />
      </div>

      {isBlurred && (
        <div
          onClick={handleDismiss}
          className="fixed inset-0 z-20 bg-black/25 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
        />
      )}

      <div 
        className={`fixed left-0 right-0 px-5 z-10 flex justify-start items-center pointer-events-none transition-all duration-300 ${
          isBlurred ? 'opacity-30 blur-[6px]' : 'opacity-100 blur-none'
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
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] px-5 z-10 pointer-events-none transition-all duration-300 ${
          isBlurred ? 'opacity-30 blur-[8px]' : 'opacity-100 blur-none'
        }`}
      >
        <div className="w-full flex flex-col items-start pointer-events-auto">
          <h2 className="text-white text-[19px] font-bold tracking-tight mb-3 px-1 text-left">
            Идеи, которые вдохновляют
          </h2>

          <div className="w-full grid grid-cols-2 gap-2.5">
            {ideas.map((item) => (
              <div
                key={item.id}
                className="w-full h-[116px] rounded-[24px] mt-glass p-3 flex flex-col justify-start gap-1.5 shadow-sm cursor-pointer active:scale-[0.97] transition-transform"
              >
                <div className="w-full flex items-center gap-1.5">
                  <img
                    src="/idea.png"
                    alt="Idea"
                    className="w-4 h-4 object-contain brightness-0 invert opacity-90 shrink-0 pointer-events-none"
                  />
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
        className="fixed left-0 right-0 px-5 z-30 pointer-events-none transition-[bottom] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ 
          bottom: keyboardHeight > 0 
            ? `${keyboardHeight + 6}px` 
            : '10px'
        }}
      >
        <div className="w-full max-w-[420px] mx-auto pointer-events-auto">
          <SearchInput onFocus={handleInputFocus} onBlur={handleInputBlur} />
        </div>
      </div>

    </main>
  );
}
