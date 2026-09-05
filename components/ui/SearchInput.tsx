"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const textVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

interface SearchInputProps {
  onFocusChange?: (isFocused: boolean) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onFocusChange }) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const placeholder = "Давайте планировать…";

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      // Сброс высоты для возможности "сдутия" при стирании
      textareaRef.current.style.height = "22px";
      const scrollH = textareaRef.current.scrollHeight;
      // 22px = 1 строка, 88px = 4 строки
      const targetH = Math.min(Math.max(scrollH, 22), 88);
      textareaRef.current.style.height = `${targetH}px`;
    }
  }, [value]);

  return (
    <div className="w-full flex items-end mt-glass rounded-[26px] py-2 pr-2 pl-5 relative z-10 transition-[border-radius] duration-200">
      <div className="relative flex-1 min-h-[36px] flex items-center mr-2 py-1">
        <AnimatePresence mode="wait">
          {value === "" && (
            <motion.span
              key={placeholder}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: "backOut" }}
              className="absolute left-0 top-[7px] text-white/40 font-medium text-[15px] pointer-events-none whitespace-nowrap tracking-tight"
            >
              {placeholder}
            </motion.span>
          )}
        </AnimatePresence>

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleInput}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          className="bg-transparent border-none outline-none text-white text-[15px] leading-[22px] w-full font-medium resize-none overflow-y-auto max-h-[88px] tracking-tight relative z-10 block"
        />
      </div>

      <button
        type="button"
        className="h-[36px] px-5 btn-send-white flex items-center justify-center active:scale-90 transition-all duration-300 shrink-0 rounded-full cursor-pointer self-end"
      >
        <img
          src="/send.png"
          alt="Send"
          className="w-[15px] h-[15px] object-contain pointer-events-none"
        />
      </button>
    </div>
  );
};
