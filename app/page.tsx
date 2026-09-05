'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { JellyButton } from '@/components/ui/JellyButton';
import { SearchInput } from '@/components/ui/SearchInput';
import { TopTabBar, TabType } from '@/components/ui/TopTabBar';
import { CalendarView } from '@/components/views/CalendarView';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isInputActive, setIsInputActive] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartY = useRef<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartY.current = clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartY.current === null) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = touchStartY.current - clientY;

    if (!isScheduleOpen) {
      const progress = Math.max(0, Math.min(1, deltaY / 130));
      setDragProgress(progress);
    } else {
      const progress = Math.max(0, Math.min(1, 1 - (-deltaY) / 130));
      setDragProgress(progress);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null) return;
    setIsDragging(false);
    touchStartY.current = null;

    if (!isScheduleOpen) {
      if (dragProgress > 0.32) {
        setIsScheduleOpen(true);
        setDragProgress(1);
      } else {
        setDragProgress(0);
      }
    } else {
      if (dragProgress < 0.68) {
        setIsScheduleOpen(false);
        setDragProgress(0);
      } else {
        setDragProgress(1);
      }
    }
  };

  useEffect(() => {
    if (!isDragging) {
      setDragProgress(isScheduleOpen ? 1 : 0);
    }
  }, [isScheduleOpen, isDragging]);

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
  const currentHeight = dragProgress * 152;
  const plateBlur = (1 - dragProgress) * 4;

  return (
    <main className="fixed inset-0 w-full h-[100dvh] bg-[#0a0a0a] overflow-hidden">
      
      {isBlurred && (
        <div
          onClick={handleDismiss}
          className="fixed inset-0 z-20 bg-black/25 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
        />
      )}

      <div 
        className={`fixed left-0 right-0 px-5 z-20 flex items-center pointer-events-none transition-all duration-300 ${
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

        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <TopTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {activeTab === 'chat' && (
        <>
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
                : '8px'
            }}
          >
            <div className="w-full max-w-[420px] mx-auto flex flex-col pointer-events-auto">
              <SearchInput onFocus={handleInputFocus} onBlur={handleInputBlur} />

              {keyboardHeight === 0 && (
                <>
                  <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleTouchStart}
                    onMouseMove={handleTouchMove}
                    onMouseUp={handleTouchEnd}
                    className="w-full overflow-hidden select-none"
                    style={{
                      height: `${currentHeight}px`,
                      opacity: dragProgress,
                      filter: `blur(${plateBlur}px)`,
                      transition: isDragging ? 'none' : 'all 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                      marginTop: dragProgress > 0.05 ? '8px' : '0px',
                    }}
                  >
                    <div className="w-full h-[152px] mt-glass rounded-[28px] p-4 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-[15px] font-bold tracking-tight">
                          Ближайшее
                        </span>

                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-white/45 hover:text-white/75 transition-colors cursor-pointer"
                        >
                          <span className="text-[13px] font-medium tracking-tight">
                            Смотреть все
                          </span>
                          <img
                            src="/calendar.png"
                            alt="Calendar"
                            className="w-3.5 h-3.5 object-contain brightness-0 invert opacity-45 pointer-events-none"
                          />
                        </button>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-white/60 text-[12px] font-medium tracking-tight mb-2">
                          Сегодня, 8 Сентября
                        </span>

                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-[13px] font-semibold tracking-tight w-[100px]">
                              09:00-15:00
                            </span>
                            <span className="text-white/90 text-[13px] font-medium tracking-tight">
                              Пары
                            </span>
                          </div>

                          <div className="w-[100px] flex justify-center py-0.5">
                            <div className="w-[1.5px] h-3 bg-white/20 rounded-full" />
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-white/75 text-[13px] font-semibold tracking-tight w-[100px]">
                              16:00-17:30
                            </span>
                            <span className="text-white/75 text-[13px] font-medium tracking-tight">
                              Немецкий
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleTouchStart}
                    onMouseMove={handleTouchMove}
                    onMouseUp={handleTouchEnd}
                    className="w-full pt-1.5 pb-0.5 px-2 flex justify-center items-center cursor-grab active:cursor-grabbing select-none"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={isScheduleOpen ? "open-hint" : "closed-hint"}
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(4px)" }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="text-white/35 text-[11px] font-medium text-center tracking-tight leading-tight pointer-events-none"
                      >
                        {isScheduleOpen
                          ? "Теперь потяните сверху вниз, чтобы вернуть чат в привычный вид"
                          : "Потяните снизу вверх чтобы быстро посмотреть свои ближайшие планы"}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'calendar' && (
        <CalendarView />
      )}

    </main>
  );
}
