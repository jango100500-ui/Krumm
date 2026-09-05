"use client";

import React from "react";

export type TabType = "chat" | "calendar";

interface TopTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TopTabBar: React.FC<TopTabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="h-11 w-[205px] p-1 rounded-full mt-glass flex items-center relative shadow-sm select-none">
      <div
        className="absolute top-1 bottom-1 rounded-full bg-white/15 border border-white/10 backdrop-blur-md shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform pointer-events-none"
        style={{
          left: activeTab === "chat" ? "4px" : "calc(50% + 2px)",
          width: "calc(50% - 6px)",
        }}
      />

      <button
        type="button"
        onClick={() => onTabChange("chat")}
        className={`relative flex-1 h-full rounded-full text-[13px] font-medium tracking-tight flex items-center justify-center outline-none transition-colors duration-300 z-10 cursor-pointer ${
          activeTab === "chat" ? "text-white font-semibold" : "text-white/45"
        }`}
      >
        Чат
      </button>

      <button
        type="button"
        onClick={() => onTabChange("calendar")}
        className={`relative flex-1 h-full rounded-full text-[13px] font-medium tracking-tight flex items-center justify-center outline-none transition-colors duration-300 z-10 cursor-pointer ${
          activeTab === "calendar" ? "text-white font-semibold" : "text-white/45"
        }`}
      >
        Календарь
      </button>
    </div>
  );
};
