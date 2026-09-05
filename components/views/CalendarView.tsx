"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export const CalendarView: React.FC = () => {
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
    { name: "ПН", day: 7 },
    { name: "ВТ", day: 8 },
    { name: "СР", day: 9 },
    { name: "ЧТ", day: 10 },
    { name: "ПТ", day: 11 },
    { name: "СБ", day: 12 },
    { name: "ВС", day: 13 },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scroll-y-touch select-none pt-[calc(env(safe-area-inset-top,44px)+66px)] pb-[calc(env(safe-area-inset-bottom,20px)+30px)] px-5">
      <div className="w-full max-w-[420px] mx-auto flex flex-col">
        
        <div className="flex items-center gap-1 mb-4 cursor-pointer w-fit">
          <span className="text-white text-[22px] font-bold tracking-tight">
            Сентябрь
          </span>
          <svg
            className="w-4 h-4 text-white/60 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="w-full grid grid-cols-7 gap-1 mb-5">
          {weekDays.map((item) => {
            const isSelected = item.day === selectedDay;
            return (
              <button
                key={item.day}
                type="button"
                onClick={() => setSelectedDay(item.day)}
                className="flex flex-col items-center gap-1.5 py-1 outline-none"
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

        <div className="w-full flex items-center justify-between mb-4 px-1">
          <span className="text-white text-[16px] font-bold tracking-tight">
            Понедельник, 8 сентября
          </span>
          <span className="text-white/40 text-[13px] font-medium tracking-tight">
            Сегодня
          </span>
        </div>

        <div className="w-full flex flex-col gap-4 relative">
          
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

                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                  <span className="text-white/80 text-[11px] font-medium tracking-tight">
                    Обязательно
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-200 ${
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

              <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                <span className="text-white/80 text-[11px] font-medium tracking-tight">
                  Обязательно
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

        </div>
      </div>
    </div>
  );
};
