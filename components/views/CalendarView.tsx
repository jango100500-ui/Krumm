"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface CalendarViewProps {
  mode: "day" | "week";
  onToggleMode: () => void;
}

const HOURS_24 = Array.from(
  { length: 24 },
  (_, i) => `${String(i).padStart(2, "0")}:00`
);

const WEEK_DAYS = [
  { name: "пн", day: 8 },
  { name: "вт", day: 9 },
  { name: "ср", day: 10 },
  { name: "чт", day: 11 },
  { name: "пт", day: 12 },
  { name: "сб", day: 13 },
  { name: "вс", day: 14 },
];

const truncateTitle = (title: string, maxLen = 7) => {
  if (title.length > maxLen) {
    return title.slice(0, maxLen) + "…";
  }
  return title;
};

export const CalendarView: React.FC<CalendarViewProps> = ({ mode }) => {
  const [selectedDay, setSelectedDay] = useState<number>(8);
  const [isSubtasksOpen, setIsSubtasksOpen] = useState<boolean>(true);
  const [isStandaloneTaskDone, setIsStandaloneTaskDone] = useState<boolean>(false);

  const [subtasks, setSubtasks] = useState<SubTask[]>([
    { id: "1", title: "Зайти в магазин", completed: false },
    { id: "2", title: "Спросить Аню о проекте", completed: false },
    { id: "3", title: "Купить тетрадь", completed: false },
  ]);

  const scrollGridRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === "week" && scrollGridRef.current) {
      scrollGridRef.current.scrollTop = 8 * 52 - 16;
    }
  }, [mode]);

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleBodyHorizontalScroll = () => {
    if (bodyScrollRef.current && headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = bodyScrollRef.current.scrollLeft;
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-[calc(env(safe-area-inset-top,44px)+66px)] select-none overflow-hidden">
      <div className="w-full max-w-[420px] mx-auto px-5 flex-shrink-0 z-10 pb-2">
        {mode === "day" ? (
          <>
            <div className="w-full grid grid-cols-7 gap-1 mb-3">
              {WEEK_DAYS.map((item) => {
                const isSelected = item.day === selectedDay;
                return (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => setSelectedDay(item.day)}
                    className="flex flex-col items-center gap-1 py-1 outline-none cursor-pointer"
                  >
                    <span className="text-[11px] font-semibold text-white/40 tracking-tight">
                      {item.name}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? "bg-[#FF453A] text-white font-bold shadow-[0_2px_12px_rgba(255,69,58,0.4)] scale-105"
                          : "text-white font-medium hover:bg-white/10"
                      }`}
                    >
                      <span className="text-[14px] leading-none">{item.day}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="w-full flex items-center justify-between px-1">
              <span className="text-white text-[16px] font-bold tracking-tight">
                Понедельник, 8 сентября
              </span>
              <span className="text-white/40 text-[13px] font-medium tracking-tight">
                Сегодня
              </span>
            </div>
          </>
        ) : (
          <div className="w-full flex items-center">
            <div className="w-12 flex-shrink-0" />
            <div
              ref={headerScrollRef}
              className="flex-1 overflow-hidden scrollbar-none"
            >
              <div className="flex gap-2 w-max pr-4">
                {WEEK_DAYS.map((item) => (
                  <div
                    key={item.day}
                    className="w-[72px] flex flex-col items-center gap-1 py-1 pointer-events-none"
                  >
                    <span className="text-[11px] font-semibold text-white/40 tracking-tight uppercase">
                      {item.name}
                    </span>
                    <span className="text-[14px] font-semibold text-white/80 leading-none">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 w-full overflow-hidden relative">
        <AnimatePresence mode="wait">
          {mode === "day" ? (
            <motion.div
              key="day-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full overflow-y-auto scroll-y-touch px-5 pb-[calc(env(safe-area-inset-bottom,20px)+40px)]"
            >
              <div className="w-full max-w-[420px] mx-auto flex flex-col gap-4 relative pt-1">
                
                <div className="w-full flex items-stretch gap-3">
                  <div className="w-11 flex flex-col justify-between items-end flex-shrink-0 py-1 select-none">
                    <span className="text-[12px] font-semibold text-white/70 tracking-tight leading-none">
                      09:00
                    </span>
                    <div className="w-[1.5px] flex-1 bg-white/15 my-1.5 rounded-full" />
                    <span className="text-[12px] font-semibold text-white/35 tracking-tight leading-none">
                      15:00
                    </span>
                  </div>

                  <div className="flex-1 rounded-[26px] bg-[rgba(255,69,58,0.07)] border border-[rgba(255,69,58,0.18)] backdrop-blur-[40px] p-4 flex flex-col gap-3 shadow-[0_8px_32px_rgba(255,69,58,0.12)]">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-white text-[16px] font-bold tracking-tight leading-tight">
                          Пары
                        </span>
                        <span className="text-white/60 text-[12px] font-medium tracking-tight mt-0.5">
                          09:00 — 15:00
                        </span>
                      </div>

                      <div className="px-3 py-1 rounded-full bg-[#28282A] flex items-center justify-center shadow-sm">
                        <span className="text-white/90 text-[11px] font-semibold tracking-tight">
                          В приоритете
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex flex-col">
                      <button
                        type="button"
                        onClick={() => setIsSubtasksOpen(!isSubtasksOpen)}
                        className="w-full flex items-center justify-between outline-none cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-white text-[13px] font-semibold tracking-tight">
                            Есть дополнительные задачи
                          </span>
                          <div className="w-5 h-5 rounded-full bg-[#FF453A] text-white font-bold text-[11px] flex items-center justify-center shadow-sm">
                            {subtasks.length}
                          </div>
                        </div>

                        <motion.svg
                          animate={{ rotate: isSubtasksOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="w-4 h-4 text-white/50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </motion.svg>
                      </button>

                      <AnimatePresence>
                        {isSubtasksOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden flex flex-col gap-2 pt-3"
                          >
                            {subtasks.map((st) => (
                              <div
                                key={st.id}
                                onClick={() => toggleSubtask(st.id)}
                                className="flex items-center gap-2.5 cursor-pointer py-0.5"
                              >
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200 flex-shrink-0 ${
                                    st.completed
                                      ? "bg-[#FF453A] border-[#FF453A] text-white"
                                      : "border-white/30 bg-white/5"
                                  }`}
                                >
                                  {st.completed && (
                                    <svg
                                      className="w-3 h-3 text-white stroke-[3]"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>

                                <span
                                  className={`text-[13px] font-medium tracking-tight transition-all duration-200 ${
                                    st.completed
                                      ? "text-white/40 line-through"
                                      : "text-white/85"
                                  }`}
                                >
                                  {st.title}
                                </span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="w-full flex items-stretch gap-3">
                  <div className="w-11 flex flex-col justify-between items-end flex-shrink-0 py-1 select-none">
                    <span className="text-[12px] font-semibold text-white/70 tracking-tight leading-none">
                      15:10
                    </span>
                    <div className="w-[1.5px] flex-1 bg-white/15 my-1.5 rounded-full" />
                    <span className="text-[12px] font-semibold text-white/35 tracking-tight leading-none">
                      15:40
                    </span>
                  </div>

                  <div className="flex-1 rounded-[26px] mt-glass p-4 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col">
                      <span className="text-white text-[15px] font-bold tracking-tight leading-tight">
                        Зайти в магазин
                      </span>
                      <span className="text-white/50 text-[12px] font-medium tracking-tight mt-0.5">
                        15:10 — 15:40
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsStandaloneTaskDone(!isStandaloneTaskDone)}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                        isStandaloneTaskDone
                          ? "bg-[#FF453A] border-[#FF453A] text-white"
                          : "border-white/30 bg-white/5"
                      }`}
                    >
                      {isStandaloneTaskDone && (
                        <svg
                          className="w-3.5 h-3.5 text-white stroke-[3]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="w-full flex items-stretch gap-3">
                  <div className="w-11 flex flex-col justify-between items-end flex-shrink-0 py-1 select-none">
                    <span className="text-[12px] font-semibold text-white/70 tracking-tight leading-none">
                      17:00
                    </span>
                    <div className="w-[1.5px] flex-1 bg-white/15 my-1.5 rounded-full" />
                    <span className="text-[12px] font-semibold text-white/35 tracking-tight leading-none">
                      18:30
                    </span>
                  </div>

                  <div className="flex-1 rounded-[26px] mt-glass p-4 flex items-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <span className="text-white/80 text-[14px] font-medium tracking-tight">
                      Свободное время
                    </span>
                  </div>
                </div>

                <div className="w-full flex items-stretch gap-3">
                  <div className="w-11 flex flex-col justify-between items-end flex-shrink-0 py-1 select-none">
                    <span className="text-[12px] font-semibold text-white/70 tracking-tight leading-none">
                      19:00
                    </span>
                    <div className="w-[1.5px] flex-1 bg-white/15 my-1.5 rounded-full" />
                    <span className="text-[12px] font-semibold text-white/35 tracking-tight leading-none">
                      20:00
                    </span>
                  </div>

                  <div className="flex-1 rounded-[26px] mt-glass p-4 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col">
                      <span className="text-white text-[15px] font-bold tracking-tight leading-tight">
                        Немецкий
                      </span>
                      <span className="text-white/50 text-[12px] font-medium tracking-tight mt-0.5">
                        19:00 — 20:00
                      </span>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-[#28282A] flex items-center justify-center shadow-sm">
                      <span className="text-white/90 text-[11px] font-semibold tracking-tight">
                        В приоритете
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full flex items-start gap-3 mt-1">
                  <span className="text-[12px] font-semibold text-white/40 tracking-tight pt-3.5 w-11 flex-shrink-0 text-right">
                    21:00
                  </span>

                  <button
                    type="button"
                    className="flex-1 h-[52px] rounded-[26px] border border-dashed border-white/20 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md flex items-center justify-center gap-2 transition-colors duration-200 outline-none cursor-pointer"
                  >
                    <img
                      src="/plus.png"
                      alt="Plus"
                      className="w-4 h-4 object-contain brightness-0 invert opacity-60 pointer-events-none"
                    />
                    <span className="text-white/60 text-[13px] font-medium tracking-tight">
                      Новое событие или задача
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="week-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              ref={scrollGridRef}
              className="w-full h-full overflow-y-auto scroll-y-touch px-5 pb-[calc(env(safe-area-inset-bottom,20px)+40px)]"
            >
              <div className="w-full max-w-[420px] mx-auto flex items-start">
                <div className="w-12 flex flex-col flex-shrink-0 z-10">
                  {HOURS_24.map((hour) => (
                    <div
                      key={hour}
                      className="h-[52px] text-[11px] font-semibold text-white/35 flex items-start tracking-tight"
                    >
                      {hour}
                    </div>
                  ))}
                </div>

                <div
                  ref={bodyScrollRef}
                  onScroll={handleBodyHorizontalScroll}
                  className="flex-1 overflow-x-auto scrollbar-none"
                >
                  <div className="relative h-[1248px] flex gap-2 w-max pr-4 border-l border-white/[0.06]">
                    <div className="absolute inset-0 flex flex-col pointer-events-none">
                      {HOURS_24.map((hour) => (
                        <div
                          key={hour}
                          className="h-[52px] border-b border-white/[0.05] w-full"
                        />
                      ))}
                    </div>

                    <div className="w-[72px] relative h-full flex-shrink-0">
                      <div
                        className="absolute left-1 right-1 rounded-[18px] bg-[rgba(255,69,58,0.07)] border border-[rgba(255,69,58,0.18)] backdrop-blur-[40px] p-2.5 flex flex-col justify-start shadow-sm overflow-hidden"
                        style={{ top: "468px", height: "312px" }}
                      >
                        <span className="text-[12px] font-bold text-white tracking-tight leading-tight">
                          {truncateTitle("Пары")}
                        </span>
                        <span className="text-[10px] font-medium text-white/60 mt-1 tracking-tight">
                          09:00–15:00
                        </span>
                      </div>
                    </div>

                    <div className="w-[72px] relative h-full flex-shrink-0">
                      <div
                        className="absolute left-1 right-1 rounded-[18px] bg-white/[0.06] border border-white/10 p-2 flex flex-col justify-center shadow-sm overflow-hidden"
                        style={{ top: "988px", height: "52px" }}
                      >
                        <span className="text-[11px] font-semibold text-white tracking-tight leading-tight">
                          {truncateTitle("Немецкий")}
                        </span>
                        <span className="text-[9px] text-white/50 mt-0.5">19:00</span>
                      </div>
                    </div>

                    <div className="w-[72px] relative h-full flex-shrink-0">
                      <div
                        className="absolute left-1 right-1 rounded-[18px] mt-glass p-2.5 flex flex-col justify-start border border-white/10 shadow-sm overflow-hidden"
                        style={{ top: "468px", height: "312px" }}
                      >
                        <span className="text-[12px] font-bold text-white tracking-tight leading-tight">
                          {truncateTitle("Пары")}
                        </span>
                        <span className="text-[10px] font-medium text-white/60 mt-1 tracking-tight">
                          09:00–15:00
                        </span>
                      </div>
                    </div>

                    <div className="w-[72px] relative h-full flex-shrink-0">
                      <div
                        className="absolute left-1 right-1 rounded-[18px] mt-glass p-2.5 flex flex-col justify-start border border-white/10 shadow-sm overflow-hidden"
                        style={{ top: "468px", height: "312px" }}
                      >
                        <span className="text-[12px] font-bold text-white tracking-tight leading-tight">
                          {truncateTitle("Пары")}
                        </span>
                        <span className="text-[10px] font-medium text-white/60 mt-1 tracking-tight">
                          09:00–15:00
                        </span>
                      </div>

                      <div
                        className="absolute left-1 right-1 rounded-[18px] bg-white/[0.06] border border-white/10 p-2 flex flex-col justify-center shadow-sm overflow-hidden"
                        style={{ top: "936px", height: "52px" }}
                      >
                        <span className="text-[11px] font-semibold text-white tracking-tight leading-tight">
                          {truncateTitle("Тренировка")}
                        </span>
                        <span className="text-[9px] text-white/50 mt-0.5">18:00</span>
                      </div>

                      <div
                        className="absolute left-1 right-1 rounded-[18px] bg-white/[0.06] border border-white/10 p-2 flex flex-col justify-center shadow-sm overflow-hidden"
                        style={{ top: "988px", height: "52px" }}
                      >
                        <span className="text-[11px] font-semibold text-white tracking-tight leading-tight">
                          {truncateTitle("Немецкий")}
                        </span>
                        <span className="text-[9px] text-white/50 mt-0.5">19:00</span>
                      </div>
                    </div>

                    <div className="w-[72px] relative h-full flex-shrink-0">
                      <div
                        className="absolute left-1 right-1 rounded-[18px] mt-glass p-2.5 flex flex-col justify-start border border-white/10 shadow-sm overflow-hidden"
                        style={{ top: "468px", height: "312px" }}
                      >
                        <span className="text-[12px] font-bold text-white tracking-tight leading-tight">
                          {truncateTitle("Пары")}
                        </span>
                        <span className="text-[10px] font-medium text-white/60 mt-1 tracking-tight">
                          09:00–15:00
                        </span>
                      </div>
                    </div>

                    <div className="w-[72px] relative h-full flex-shrink-0">
                      <div
                        className="absolute left-1 right-1 rounded-[18px] bg-white/[0.08] border border-white/15 p-2.5 flex flex-col justify-start shadow-sm overflow-hidden"
                        style={{ top: "728px", height: "104px" }}
                      >
                        <span className="text-[11px] font-semibold text-white tracking-tight leading-tight">
                          {truncateTitle("Встреча с Машей")}
                        </span>
                        <span className="text-[9px] text-white/50 mt-1">14:00</span>
                      </div>
                    </div>

                    <div className="w-[72px] relative h-full flex-shrink-0" />
                  </div>
                </div>
              </div>

              <div className="w-full py-6 flex items-center justify-center cursor-pointer">
                <span className="text-[13px] font-medium text-white/45 hover:text-white/70 transition-colors tracking-tight">
                  + ещё 7 задач на неделе
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
