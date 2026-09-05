"use client";

import React from "react";
import { motion } from "framer-motion";

export type TabType = "chat" | "calendar";

interface TopTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "chat", label: "Чат" },
  { id: "calendar", label: "Календарь" },
];

export const TopTabBar: React.FC<TopTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="h-11 w-[205px] p-1 rounded-full mt-glass flex items-center relative shadow-sm select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative flex-1 h-full rounded-full text-[13px] font-medium tracking-tight flex items-center justify-center outline-none transition-colors duration-200 z-10 cursor-pointer ${
              isActive ? "text-white font-semibold" : "text-white/45"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="topTabBarSlider"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute inset-0 bg-white/15 backdrop-blur-md rounded-full border border-white/10 shadow-sm -z-10"
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
