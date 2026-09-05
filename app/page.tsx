'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { JellyButton } from '@/components/ui/JellyButton';
import { SearchInput } from '@/components/ui/SearchInput';
import { TopTabBar, TabType } from '@/components/ui/TopTabBar';
import { CalendarView } from '@/components/views/CalendarView';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [calendarMode, setCalendarMode] = useState<'day' | 'week'>('day');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isInputActive, setIsInputActive] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isDraggingPlate, setIsDraggingPlate] = useState(false);

  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipingPage, setIsSwipingPage] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const gestureLock = useRef<'horizontal' | 'vertical' | null>(null);

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

  const handlePageTouchStart = (e: React.TouchEvent) => {
    if (keyboardHeight > 0 || isInputActive) return;

    const startX = e.touches[0].clientX;
    const startY = e.touches[0].clientY;

    if (activeTab === 'calendar' && startX > 32) {
      return;
    }

    touchStartPos.current = { x: startX, y: startY };
    gestureLock.current = null;
  };

  const handlePageTouchMove = (e: React.TouchEvent) => {
    if (keyboardHeight > 0 || isInputActive) return;
    if (!touchStartPos.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartPos.current.x;
    const deltaY = currentY - touchStartPos.current.y;

    if (!gestureLock.current) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          gestureLock.current = 'horizontal';
          setIsSwipingPage(true);
        } else {
          gestureLock.current = 'vertical';
        }
      }
    }

    if (gestureLock.current === 'horizontal') {
      if (activeTab === 'chat') {
        const clamped = Math.min(0, Math.max(-window.innerWidth, deltaX));
        setSwipeOffset(clamped);
      } else {
        const clamped = Math.max(0, Math.min(window.innerWidth, deltaX));
        setSwipeOffset(clamped);
      }
    }
  };

  const handlePageTouchEnd = () => {
    if (keyboardHeight > 0 || isInputActive) {
      setSwipeOffset(0);
      setIsSwipingPage(false);
      touchStartPos.current = null;
      gestureLock.current = null;
      return;
    }

    if (gestureLock.current === 'horizontal') {
      setIsSwipingPage(false);
      const threshold = window.innerWidth * 0.25;

      if (activeTab === 'chat') {
        if (swipeOffset < -threshold) {
          setActiveTab('calendar');
        }
      } else {
        if (swipeOffset > threshold) {
          setActiveTab('chat');
        }
      }
      setSwipeOffset(0);
    }

    touchStartPos.current = null;
    gestureLock.current = null;
  };

  const handleBottomTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setIsDraggingPlate(true);
  };

  const handleBottomTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!touchStartPos.current) return;
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartPos.current.y - currentY;

    if (Math.abs(deltaY) > 8 && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (!isScheduleOpen) {
      const progress = Math.max(0, Math.min(1, deltaY / 130));
      setDragProgress(progress);
    } else {
      const progress = Math.max(0, Math.min(1, 1 - (-deltaY) / 130));
      setDragProgress(progress);
    }
  };

  const handleBottomTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!touchStartPos.current) return;
    setIsDraggingPlate(false);
    touchStartPos.current = null;

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
    if (!isDraggingPlate) {
      setDragProgress(isScheduleOpen ? 1 : 0);
    }
  }, [isScheduleOpen, isDraggingPlate]);

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
  const currentPlateHeight = dragProgress * 138;
  const currentPlateBlur = (1 - dragProgress) * 3;

  const currentTranslateX = activeTab === 'chat' ? swipeOffset : -window.innerWidth + swipeOffset;

  const handleRoundButtonClick = () => {
    if (activeTab === 'calendar') {
      setCalendarMode((prev) => (prev === 'day' ? 'week' : 'day'));
    }
  };

  const getRoundButtonIcon = () => {
    if (activeTab === 'chat') {
      return { src: '/menu.png', key: 'menu' };
    }
    return calendarMode === 'day'
      ? { src: '/month.png', key: 'month' }
      : { src: '/week.png', key: 'week' };
  };

  const currentButtonIcon = getRoundButtonIcon();

  return (
    <main
      onTouchStart={handlePageTouchStart}
      onTouchMove={handlePageTouchMove}
      onTouchEnd={handlePageTouchEnd}
      className="fixed inset-0 w-full h-[100dvh] bg-[#0a0a0a] overflow-hidden select-none"
    >
      {isBlurred && (
        <div
          onClick={handleDismiss}
          className="fixed inset-0 z-20 bg-black/50 transition-opacity duration-300 pointer-events-auto"
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
          onClick={handleRoundButtonClick}
          flashColor="bg-white/10"
          className="w-11 h-11 rounded-full mt-glass flex items-center justify-center shadow-sm pointer-events-auto"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentButtonIcon.key}
              src={currentButtonIcon.src}
              alt="Action"
              initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.8 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.8 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="w-5 h-5 object-contain brightness-0 invert opacity-80 pointer-events-none"
            />
          </AnimatePresence>
        </JellyButton>

        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <TopTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      <div
        className="w-[200vw] h-full flex will-change-transform"
        style={{
          transform: `translateX(${currentTranslateX}px)`,
          transition: isSwipingPage ? 'none' : 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="w-[100vw] h-full relative overflow-hidden flex flex-col justify-between flex-shrink-0">
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] px-5 z-10 pointer-events-none transition-all duration-300 ${
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
            className="absolute left-0 right-0 px-5 z-30 pointer-events-none transition-[bottom] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              bottom: keyboardHeight > 0 ? `${keyboardHeight + 6}px` : '8px',
            }}
          >
            <div
              onTouchStart={handleBottomTouchStart}
              onTouchMove={handleBottomTouchMove}
              onTouchEnd={handleBottomTouchEnd}
              className="w-full max-w-[420px] mx-auto flex flex-col pointer-events-auto select-none"
            >
              <SearchInput onFocus={handleInputFocus} onBlur={handleInputBlur} />

              {keyboardHeight === 0 && (
                <>
                  <div
                    className="w-full overflow-hidden select-none"
                    style={{
                      height: `${currentPlateHeight}px`,
                      opacity: dragProgress,
                      filter: `blur(${currentPlateBlur}px)`,
                      transition: isDraggingPlate ? 'none' : 'all 380ms cubic-bezier(0.16, 1, 0.3, 1)',
                      marginTop: dragProgress > 0.05 ? '8px' : '0px',
                    }}
                  >
                    <div className="w-full h-[138px] mt-glass rounded-[28px] p-4 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-[15px] font-bold tracking-tight">
                          Ближайшее
                        </span>

                        <button
                          type="button"
                          onClick={() => setActiveTab('calendar')}
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

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-[13px] font-semibold tracking-tight">
                              09:00-15:00
                            </span>
                            <span className="text-white/90 text-[13px] font-medium tracking-tight">
                              Пары
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-white/75 text-[13px] font-semibold tracking-tight">
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
                    onTouchStart={handleBottomTouchStart}
                    onTouchMove={handleBottomTouchMove}
                    onTouchEnd={handleBottomTouchEnd}
                    className="w-full h-8 px-2 flex justify-center items-center cursor-grab active:cursor-grabbing select-none relative"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={isScheduleOpen ? 'open-hint' : 'closed-hint'}
                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute inset-0 flex items-center justify-center text-white/35 text-[11px] font-medium text-center tracking-tight leading-tight pointer-events-none px-3"
                      >
                        {isScheduleOpen
                          ? 'Теперь потяните сверху вниз, чтобы вернуть чат в привычный вид'
                          : 'Потяните снизу вверх чтобы быстро посмотреть свои ближайшие планы'}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-[100vw] h-full relative overflow-hidden flex-shrink-0">
          <CalendarView
            mode={calendarMode}
            onToggleMode={() => setCalendarMode((prev) => (prev === 'day' ? 'week' : 'day'))}
          />
        </div>
      </div>
    </main>
  );
}
