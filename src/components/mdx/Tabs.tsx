"use client";

import React, { useState, ReactNode } from "react";

interface TabsProps {
  children: ReactNode;
}

interface TabChild {
  props: {
    children: ReactNode;
    label: string;
  };
}

export default function Tabs({ children }: TabsProps): React.JSX.Element {
  const tabArray = React.Children.toArray(children) as TabChild[];
  const [activeTab, setActiveTab] = useState(0);

  if (!tabArray || tabArray.length === 0) {
    return <div>No tabs available</div>;
  }

  return (
    <div className="my-6">
      <div className="border-b border-gray-200" role="tablist">
        {tabArray.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-terracotta focus-visible:ring-offset-2 ${
              activeTab === index
                ? "border-blueprint-terracotta text-blueprint-terracotta"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
            }`}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`tabpanel-${index}`}
          >
            {tab.props?.label || `Tab ${index + 1}`}
          </button>
        ))}
      </div>
      <div
        className="mt-4 p-4"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {tabArray[activeTab]?.props?.children}
      </div>
    </div>
  );
}

interface TabProps {
  children: React.ReactNode;
  label: string;
}

export function Tab({ children }: TabProps): React.JSX.Element {
  return <>{children}</>;
}
