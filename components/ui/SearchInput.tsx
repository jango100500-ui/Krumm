"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholder = "Давайте планировать…";

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex items-center h-12 relative">
      <div className="flex-1 h-full mt-glass rounded-full flex items-center justify-between pr-1 pl-5 relative z-10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
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
                className="absolute left-0 text-white/30 font-medium text-[15px] pointer-events-none whitespace-nowrap tracking-tight"
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
            className="bg-transparent border-none outline-none text-white text-[15px] w-full font-medium relative z-10 tracking-tight"
          />
        </div>

        <button 
          type="button"
          className="h-[40px] px-5 btn-send-white flex items-center justify-center active:scale-90 transition-all shrink-0 rounded-full cursor-pointer"
        >
          <img 
            src="/send.png" 
            alt="Send" 
            className="w-[15px] h-[15px] object-contain pointer-events-none" 
          />
        </button>
      </div>
    </div>
  );
};
