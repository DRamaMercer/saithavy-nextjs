"use client";

import React, { useState, ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
  icon?: string;
  /** Tab panel content rendered from tabs/items prop */
  content?: ReactNode;
}

interface TabProps {
  children: React.ReactNode;
  label?: string;
  id?: string;
  content?: ReactNode;
}

function Tab({ children }: TabProps): React.JSX.Element {
  return <>{children}</>;
}

interface TabsProps {
  children?: ReactNode;
  tabs?: TabItem[];
  defaultTab?: string;
  items?: TabItem[];
  /** Alias for defaultTab (as numeric index) */
  defaultActive?: number;
  /** Visual style variant */
  variant?: 'underline' | 'pills' | 'enclosed' | 'segmented';
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Stretch tabs to fill container */
  fullWidth?: boolean;
  /** Lazy render tab panels */
  lazy?: boolean;
}

function Tabs({
  children,
  tabs,
  defaultTab,
  items,
  defaultActive,
  variant = 'underline',
  orientation = 'horizontal',
  fullWidth = false,
  lazy = false,
}: TabsProps): React.JSX.Element {
  const tabItems = tabs || items || [];
  const tabArray = React.Children.toArray(children) as React.ReactElement[];

  const hasItems = tabItems.length > 0;

  // Determine initial active tab: defaultActive (index) > defaultTab (id) > 0
  const getInitialIndex = () => {
    if (defaultActive !== undefined) return defaultActive;
    if (defaultTab) {
      const idx = tabItems.findIndex((t) => t.id === defaultTab);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  };

  const [activeTab, setActiveTab] = useState(getInitialIndex);
  const [lazyRendered, setLazyRendered] = useState<Set<number>>(() => {
    if (lazy) return new Set([getInitialIndex()]);
    return new Set();
  });

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (lazy) {
      setLazyRendered((prev) => new Set([...prev, index]));
    }
  };

  if (!hasItems && tabArray.length === 0) {
    return <div>No tabs available</div>;
  }

  // --- Variant styles ---

  const listBase =
    orientation === 'horizontal'
      ? 'flex'
      : 'flex flex-col';

  const variantListStyles: Record<string, string> = {
    underline: orientation === 'horizontal'
      ? 'border-b' : 'border-r',
    pills: 'gap-1 p-1 rounded-lg',
    enclosed: 'gap-0',
    segmented: 'gap-0 p-1 rounded-lg',
  };

  const getTabButtonStyle = (isActive: boolean): React.CSSProperties => {
    switch (variant) {
      case 'underline':
        return {
          color: isActive ? 'var(--accent)' : 'var(--muted)',
          borderColor: isActive ? 'var(--accent)' : 'transparent',
          background: 'transparent',
        };
      case 'pills':
        return {
          color: isActive ? 'var(--background)' : 'var(--foreground)',
          background: isActive ? 'var(--accent)' : 'transparent',
          borderRadius: '0.375rem',
        };
      case 'enclosed':
        return {
          color: isActive ? 'var(--foreground)' : 'var(--muted)',
          background: isActive ? 'var(--background)' : 'var(--surface)',
          borderColor: isActive ? 'var(--border)' : 'transparent',
          borderBottomColor: isActive ? 'var(--background)' : 'transparent',
          borderRadius: '0.375rem 0.375rem 0 0',
          borderWidth: isActive ? '1px' : '0',
          borderStyle: 'solid',
        };
      case 'segmented':
        return {
          color: isActive ? 'var(--background)' : 'var(--foreground)',
          background: isActive ? 'var(--accent)' : 'transparent',
          borderRadius: '0.375rem',
        };
      default:
        return {};
    }
  };

  const getTabButtonClasses = (isActive: boolean) => {
    const base = `px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
      fullWidth ? 'flex-1 text-center' : ''
    }`;
    switch (variant) {
      case 'underline':
        return `${base} border-b-2 transition-colors`;
      case 'pills':
        return `${base} transition-colors`;
      case 'enclosed':
        return `${base} transition-colors -mb-px`;
      case 'segmented':
        return `${base} transition-colors`;
      default:
        return base;
    }
  };

  const borderOrientation = orientation === 'horizontal' ? 'border-b' : 'border-r';

  const renderTabButtons = () => (
    <div
      className={`${listBase} ${variantListStyles[variant]} ${variant === 'underline' ? borderOrientation : ''}`}
      style={
        variant === 'underline'
          ? { borderColor: 'var(--border)' }
          : variant === 'pills' || variant === 'segmented'
            ? { background: 'var(--surface)' }
            : undefined
      }
      role="tablist"
      aria-orientation={orientation}
    >
      {tabItems.map((tab, index) => {
        const isActive = activeTab === index;
        return (
          <button
            key={tab.id || index}
            onClick={() => handleTabClick(index)}
            className={getTabButtonClasses(isActive)}
            style={getTabButtonStyle(isActive)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  const renderTabPanel = () => {
    // If items have content prop, use that; otherwise use children
    const hasContent = hasItems && tabItems[activeTab]?.content !== undefined;

    const panelContent = hasContent
      ? tabItems[activeTab].content
      : tabArray[activeTab];

    const renderBody = () => {
      if (lazy && !lazyRendered.has(activeTab)) {
        return null;
      }
      return panelContent;
    };

    return (
      <div
        className={orientation === 'horizontal' ? 'mt-4 p-4' : 'flex-1 p-4'}
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {renderBody()}
      </div>
    );
  };

  return (
    <div
      className={`my-6 ${orientation === 'vertical' ? 'flex' : ''}`}
    >
      {renderTabButtons()}
      {renderTabPanel()}
    </div>
  );
}

Tabs.Tab = Tab;

export default Tabs;
export { Tab };
