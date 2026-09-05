"use client";

import React, { useState } from "react";
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

export const CalendarView: React.FC<CalendarViewProps> = ({ mode }) => {
  const [selectedDay, setSelectedDay] = useState<number>(8);
  const [isSubtasksOpen, setIsSubtasksOpen] = useState<boolean>(true);
  const [isStandaloneTaskDone, setIsStandaloneTaskDone] = useState<boolean>(false);

  const [subtasks, setSubtasks] = useState<SubTask[]>([
    { id: "1", title: "Зайти в магазин", completed: false },
    { id: "2", title: "Спросить Аню о проекте", completed: false },
    { id: "3", title: "Купить тетрадь", completed: false },
  ]);

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const weekDays = [
    { name: "пн", day: 8 },
    { name: "вт", day: 9 },
    { name: "ср", day: 10 },
    { name: "чт", day: 11 },
    { name: "пт", day: 12 },
    { name: "сб", day: 13 },
    { name: "вс", day: 14 },
  ];

  const hours = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  return (
    <div className="w-full h-full flex flex-col pt-[calc(env(safe-area-inset-top,44px)+66px)] select-none">
      <div className="w-full max-w-[420px] mx-auto px-5 flex-shrink-0">
        <div className="w-full flex items-center mb-3">
          <div
            className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mode === "week" ? "w-10 flex-shrink-0" : "w-0"
            }`}
          />
          <div className="flex-1 grid grid-cols-7 gap-1">
            {weekDays.map((item) => {
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
                        ? "bg-white text-black font-bold shadow-md scale-105"
                        : "text-white font-medium hover:bg-white/10"
                    }`}
                  >
                    <span className="text-[14px] leading-none">{item.day}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {mode === "day" && (
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="text-white text-[16px] font-bold tracking-tight">
              Понедельник, 8 сентября
            </span>
            <span className="text-white/40 text-[13px] font-medium tracking-tight">
              Сегодня
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scroll-y-touch px-5 pb-[calc(env(safe-area-inset-bottom,20px)+30px)]">
        <div className="w-full max-w-[420px] mx-auto">
          <AnimatePresence mode="wait">
            {mode === "day" ? (
              <motion.div
                key="day-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col gap-4 relative"
              >
                <div className="w-full flex items-start gap-3">
                  <span className="text-[12px] font-semibold text-white/40 tracking-tight pt-1 w-10 flex-shrink-0">
                    09:00
                  </span>

                  <div className="flex-1 rounded-[26px] bg-white/[0.13] border border-white/25 backdrop-blur-[40px] p-4 flex flex-col gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-white text-[16px] font-bold tracking-tight leading-tight">
                          Пары
                        </span>
                        <span className="text-white/60 text-[12px] font-medium tracking-tight mt-0.5">
                          09:00 — 15:00
                        </span>
                      </div>

                      <div className="px-3 py-1 rounded-full bg-[#2C2C2E] flex items-center justify-center shadow-sm">
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
                          <div className="w-5 h-5 rounded-full bg-[#F5F2EA] text-[#141416] font-bold text-[11px] flex items-center justify-center shadow-sm">
                            {subtasks.length}
                          </div>
                        </div>

                        <motion.svg
                          animate={{ rotate: isSubtasksOpen ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
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
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
                                      ? "bg-white border-white text-black"
                                      : "border-white/30 bg-white/5"
                                  }`}
                                >
                                  {st.completed && (
                                    <svg
                                      className="w-3 h-3 text-black stroke-[3]"
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

                <div className="w-full flex items-start gap-3">
                  <span className="text-[12px] font-semibold text-white/40 tracking-tight pt-3.5 w-10 flex-shrink-0">
                    15:00
                  </span>

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
                          ? "bg-white border-white text-black"
                          : "border-white/30 bg-white/5"
                      }`}
                    >
                      {isStandaloneTaskDone && (
                        <svg
                          className="w-3.5 h-3.5 text-black stroke-[3]"
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

                <div className="w-full flex items-start gap-3">
                  <span className="text-[12px] font-semibold text-white/40 tracking-tight pt-3.5 w-10 flex-shrink-0">
                    17:00
                  </span>

                  <div className="flex-1 rounded-[26px] mt-glass p-4 flex items-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <span className="text-white/80 text-[14px] font-medium tracking-tight">
                      Свободное время
                    </span>
                  </div>
                </div>

                <div className="w-full flex items-start gap-3">
                  <span className="text-[12px] font-semibold text-white/40 tracking-tight pt-3.5 w-10 flex-shrink-0">
                    19:00
                  </span>

                  <div className="flex-1 rounded-[26px] mt-glass p-4 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col">
                      <span className="text-white text-[15px] font-bold tracking-tight leading-tight">
                        Немецкий
                      </span>
                      <span className="text-white/50 text-[12px] font-medium tracking-tight mt-0.5">
                        19:00 — 20:00
                      </span>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-[#2C2C2E] flex items-center justify-center shadow-sm">
                      <span className="text-white/90 text-[11px] font-semibold tracking-tight">
                        В приоритете
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full flex items-start gap-3 mt-1">
                  <span className="text-[12px] font-semibold text-white/40 tracking-tight pt-3.5 w-10 flex-shrink-0">
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
              </motion.div>
            ) : (
              <motion.div
                key="week-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col relative"
              >
                <div className="w-full flex relative">
                  <div className="w-10 flex flex-col flex-shrink-0">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="h-12 text-[11px] font-medium text-white/40 flex items-start tracking-tight"
                      >
                        {hour}
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 relative h-[672px] grid grid-cols-7 border-l border-white/[0.06]">
                    <div className="absolute inset-0 flex flex-col pointer-events-none">
                      {hours.map((hour) => (
                        <div key={hour} className="h-12 border-b border-white/[0.06] w-full" />
                      ))}
                    </div>

                    <div className="col-start-1 col-span-1 relative h-full">
                      <div
                        className="absolute left-0.5 right-0.5 rounded-[16px] mt-glass p-2 flex flex-col justify-start border border-white/20 shadow-sm"
                        style={{ top: "48px", height: "288px" }}
                      >
                        <span className="text-[11px] font-bold text-white tracking-tight leading-tight">
                          Пары
                        </span>
                        <span className="text-[9px] font-medium text-white/60 mt-0.5 tracking-tight">
                          09:00 — 15:00
                        </span>
                      </div>
                    </div>

                    <div className="col-start-2 col-span-1 relative h-full">
                      <div
                        className="absolute left-0.5 right-0.5 rounded-[16px] bg-white/[0.05] border border-white/10 p-1.5 flex flex-col justify-center"
                        style={{ top: "528px", height: "48px" }}
                      >
                        <span className="text-[10px] font-semibold text-white tracking-tight leading-tight">
                          Немецкий
                        </span>
                        <span className="text-[8px] text-white/50">19:00</span>
                      </div>
                    </div>

                    <div className="col-start-3 col-span-1 relative h-full">
                      <div
                        className="absolute left-0.5 right-0.5 rounded-[16px] mt-glass p-2 flex flex-col justify-start border border-white/20 shadow-sm"
                        style={{ top: "48px", height: "288px" }}
                      >
                        <span className="text-[11px] font-bold text-white tracking-tight leading-tight">
                          Пары
                        </span>
                        <span className="text-[9px] font-medium text-white/60 mt-0.5 tracking-tight">
                          09:00 — 15:00
                        </span>
                      </div>
                    </div>

                    <div className="col-start-4 col-span-1 relative h-full">
                      <div
                        className="absolute left-0.5 right-0.5 rounded-[16px] mt-glass p-2 flex flex-col justify-start border border-white/20 shadow-sm"
                        style={{ top: "48px", height: "288px" }}
                      >
                        <span className="text-[11px] font-bold text-white tracking-tight leading-tight">
                          Пары
                        </span>
                        <span className="text-[9px] font-medium text-white/60 mt-0.5 tracking-tight">
                          09:00 — 15:00
                        </span>
                      </div>

                      <div
                        className="absolute left-0.5 right-0.5 rounded-[16px] bg-white/[0.06] border border-white/10 p-1.5 flex flex-col justify-center"
                        style={{ top: "480px", height: "46px" }}
                      >
                        <span className="text-[10px] font-semibold text-white tracking-tight leading-tight truncate">
                          Тренировка
                        </span>
                        <span className="text-[8px] text-white/50">18:00</span>
                      </div>

                      <div
                        className="absolute left-0.5 right-0.5 rounded-[16px] bg-white/[0.05] border border-white/10 p-1.5 flex flex-col justify-center"
                        style={{ top: "528px", height: "48px" }}
                      >
                        <span className="text-[10px] font-semibold text-white tracking-tight leading-tight">
                          Немецкий
                        </span>
                        <span className="text-[8px] text-white/50">19:00</span>
                      </div>
                    </div>

                    <div className="col-start-5 col-span-1 relative h-full">
                      <div
                        className="absolute left-0.5 right-0.5 rounded-[16px] mt-glass p-2 flex flex-col justify-start border border-white/20 shadow-sm"
                        style={{ top: "48px", height: "288px" }}
                      >
                        <span className="text-[11px] font-bold text-white tracking-tight leading-tight">
                          Пары
                        </span>
                        <span className="text-[9px] font-medium text-white/60 mt-0.5 tracking-tight">
                          09:00 — 15:00
                        </span>
                      </div>
                    </div>

                    <div className="col-start-6 col-span-1 relative h-full">
                      <div
                        className="absolute left-0.5 right-0.5 rounded-[16px] bg-white/[0.08] border border-white/15 p-1.5 flex flex-col justify-start"
                        style={{ top: "288px", height: "96px" }}
                      >
                        <span className="text-[10px] font-semibold text-white tracking-tight leading-tight">
                          Встреча с Машей
                        </span>
                        <span className="text-[8px] text-white/50 mt-0.5">14:00</span>
                      </div>
                    </div>

                    <div className="col-start-7 col-span-1 relative h-full" />
                  </div>
                </div>

                <div className="w-full py-5 flex items-center justify-center cursor-pointer">
                  <span className="text-[13px] font-medium text-white/45 hover:text-white/70 transition-colors tracking-tight">
                    + ещё 7 задач на неделе
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
