"use client";

import { useState } from "react";
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

interface SearchInputProps {
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onFocus, onBlur }) => {
  const [value, setValue] = useState("");
  const placeholder = "Давайте планировать…";

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
                className="absolute left-0 text-white/30 font-medium text-[16px] pointer-events-none whitespace-nowrap tracking-tight"
              >
                {placeholder}
              </motion.span>
            )}
          </AnimatePresence>

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            className="bg-transparent border-none outline-none text-white text-[16px] w-full font-medium relative z-10 tracking-tight"
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
