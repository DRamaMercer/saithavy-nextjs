"use client";

import React, { useState, ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

interface TabProps {
  children: React.ReactNode;
  label?: string;
  id?: string;
}

function Tab({ children }: TabProps): React.JSX.Element {
  return <>{children}</>;
}

interface TabsProps {
  children?: ReactNode;
  tabs?: TabItem[];
  defaultTab?: string;
  items?: TabItem[];
}

function Tabs({ children, tabs, defaultTab, items }: TabsProps): React.JSX.Element {
  const tabItems = tabs || items || [];
  const tabArray = React.Children.toArray(children) as React.ReactElement[];
  
  const hasItems = tabItems.length > 0;
  const defaultTabId = defaultTab || tabItems[0]?.id || "0";
  
  const [activeTab, setActiveTab] = useState(() => {
    if (defaultTabId) {
      const idx = tabItems.findIndex(t => t.id === defaultTabId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  if (!hasItems && tabArray.length === 0) {
    return <div>No tabs available</div>;
  }

  const renderTabButtons = () => (
    <div className="border-b" style={{ borderColor: 'var(--border)' }} role="tablist">
      {tabItems.map((tab, index) => (
        <button
          key={tab.id || index}
          onClick={() => setActiveTab(index)}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
            activeTab === index
              ? "border-amber-500"
              : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
          }`}
          style={{
            color: activeTab === index ? 'var(--accent)' : 'var(--muted)',
            borderColor: activeTab === index ? 'var(--accent)' : 'transparent',
          }}
          role="tab"
          aria-selected={activeTab === index}
          aria-controls={`tabpanel-${index}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderTabPanel = () => {
    if (hasItems) {
      return (
        <div 
          className="mt-4 p-4"
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {tabArray[activeTab]}
        </div>
      );
    }
    
    return (
      <div 
        className="mt-4 p-4"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {tabArray[activeTab]}
      </div>
    );
  };

  return (
    <div className="my-6">
      {renderTabButtons()}
      {renderTabPanel()}
    </div>
  );
}

Tabs.Tab = Tab;

export default Tabs;
export { Tab };
