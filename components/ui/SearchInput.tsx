"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JellyButton } from "@/components/ui/JellyButton";

const textVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -12,
  },
};

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface SearchInputProps {
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onFocus, onBlur }) => {
  const [value, setValue] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const placeholder = "Давайте планировать…";

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;

    setIsPressed(true);
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 380);
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  return (
    <div className="w-full flex items-center h-12 relative">
      <div
        ref={barRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`flex-1 h-full mt-glass rounded-full flex items-center justify-between pr-1 pl-5 relative z-10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] select-none cursor-text ${
          isPressed ? "jelly-active" : "jelly-idle"
        }`}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none animate-ripple bg-white/20"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: "80px",
              height: "80px",
            }}
          />
        ))}

        <div className="relative flex-1 h-full flex items-center mr-2">
          <AnimatePresence mode="wait">
            {value === "" && (
              <motion.span
                key={placeholder}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "backOut" }}
                className="absolute left-0 text-white/30 font-medium text-[16px] pointer-events-none whitespace-nowrap tracking-tight"
              >
                {placeholder}
              </motion.span>
            )}
          </AnimatePresence>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            className="bg-transparent border-none outline-none text-white text-[16px] w-full font-medium relative z-10 tracking-tight"
          />
        </div>

        <JellyButton
          type="button"
          flashColor="bg-black/15"
          className="h-[40px] px-5 btn-send-white flex items-center justify-center shrink-0 rounded-full"
        >
          <img
            src="/send.png"
            alt="Send"
            className="w-[15px] h-[15px] object-contain pointer-events-none"
          />
        </JellyButton>
      </div>
    </div>
  );
};
