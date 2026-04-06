"use client";

import React, { useState, useEffect } from "react";
import { MoreVertical, Download, Check, ChevronDown, ChevronRight } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  checked?: boolean;
  subitems?: (ChecklistItem | string)[];
}

interface ChecklistProps {
  title?: string;
  items: ChecklistItem[];
  storageKey?: string;
  totalEstimatedTime?: string;
  showProgress?: boolean;
  allowExport?: boolean;
  exportFormat?: 'text' | 'markdown';
}

const normalizeItem = (item: ChecklistItem | string, parentId: string, index: number): ChecklistItem => {
  if (typeof item === 'string') {
    return { id: `${parentId}-sub-${index}`, text: item };
  }
  return item;
};

export default function Checklist({
  title,
  items,
  storageKey,
  totalEstimatedTime,
  showProgress,
  allowExport,
  exportFormat = 'markdown',
}: ChecklistProps): React.JSX.Element {
  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({});
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved && typeof saved === "string") {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- Safe: loading persisted state from localStorage
          setCheckedStates(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load checklist state:", error);
      }
    }
  }, [storageKey]);

  const getAllItems = (items: ChecklistItem[]): ChecklistItem[] => {
    const all: ChecklistItem[] = [];
    items.forEach(item => {
      all.push(item);
      if (item.subitems) {
        item.subitems.forEach((sub, idx) => {
          all.push(normalizeItem(sub, item.id, idx));
        });
      }
    });
    return all;
  };

  const allItems = getAllItems(items || []);
  const completedCount = allItems.filter(item =>
    checkedStates[item.id] || item.checked
  ).length;
  const totalCount = allItems.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (id: string) => {
    const newStates = {
      ...checkedStates,
      [id]: !checkedStates[id],
    };
    setCheckedStates(newStates);

    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newStates));
      } catch (error) {
        console.error("Failed to save checklist state:", error);
      }
    }
  };

  const handleCheckAll = () => {
    const newStates: Record<string, boolean> = {};
    allItems.forEach(item => {
      newStates[item.id] = true;
    });
    setCheckedStates(newStates);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(newStates));
    }
  };

  const handleUncheckAll = () => {
    const newStates: Record<string, boolean> = {};
    allItems.forEach(item => {
      newStates[item.id] = false;
    });
    setCheckedStates(newStates);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(newStates));
    }
  };

  const handleReset = () => {
    setCheckedStates({});
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  const handleExport = () => {
    if (exportFormat === 'markdown') {
      let markdown = `# ${title || 'Checklist'}\n\n`;
      items?.forEach(item => {
        const isChecked = checkedStates[item.id] || item.checked;
        markdown += `- [${isChecked ? 'x' : ' '}] ${item.text}\n`;
        if (item.subitems) {
          item.subitems.forEach((sub, idx) => {
            const normalized = normalizeItem(sub, item.id, idx);
            const isSubChecked = checkedStates[normalized.id] || normalized.checked;
            markdown += `  - [${isSubChecked ? 'x' : ' '}] ${normalized.text}\n`;
          });
        }
      });

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'checklist'}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      let text = `${title || 'Checklist'}\n${'='.repeat(title?.length || 10)}\n\n`;
      items?.forEach(item => {
        const isChecked = checkedStates[item.id] || item.checked;
        text += `[${isChecked ? 'X' : ' '}] ${item.text}\n`;
        if (item.subitems) {
          item.subitems.forEach((sub, idx) => {
            const normalized = normalizeItem(sub, item.id, idx);
            const isSubChecked = checkedStates[normalized.id] || normalized.checked;
            text += `  [${isSubChecked ? 'X' : ' '}] ${normalized.text}\n`;
          });
        }
      });

      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'checklist'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setShowMenu(false);
  };

  return (
    <div className="my-6 p-4 rounded-lg border border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        {title && (
          <h4 className="font-semibold text-gray-900">{title}</h4>
        )}
        <div className="flex items-center gap-2">
          {showProgress && totalCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                {completedCount}/{totalCount}
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
          {allowExport && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                aria-label="Checklist options"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={handleCheckAll}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Check All
                  </button>
                  <button
                    onClick={handleUncheckAll}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    Uncheck All
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export as {exportFormat === 'markdown' ? 'Markdown' : 'Text'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {totalEstimatedTime && (
        <p className="text-xs text-gray-500 mb-3">
          ⏱ Estimated time: {totalEstimatedTime}
        </p>
      )}
      <ul className="space-y-2">
        {items && items.map((item) => {
          const hasSubitems = item.subitems && item.subitems.length > 0;
          const isChecked = checkedStates[item.id] || item.checked || false;

          return (
            <li key={item.id} className="flex items-start gap-2">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={isChecked}
                  onChange={() => handleToggle(item.id)}
                />
                {hasSubitems && (
                  <span className="ml-1 mt-1 text-gray-400">
                    <ChevronDown className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${isChecked ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {item.text}
                </span>
                {hasSubitems && (
                  <ul className="ml-6 mt-2 space-y-1">
                    {item.subitems!.map((sub, idx) => {
                      const normalized = normalizeItem(sub, item.id, idx);
                      const isSubChecked = checkedStates[normalized.id] || normalized.checked || false;
                      return (
                        <li key={normalized.id} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            className="mt-0.5 w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            checked={isSubChecked}
                            onChange={() => handleToggle(normalized.id)}
                          />
                          <span className={`text-xs ${isSubChecked ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                            {normalized.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
