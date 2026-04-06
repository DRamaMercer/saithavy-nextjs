"use client";

import React, { useState, ReactNode } from "react";

interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

interface AccordionItemProps {
  title: string;
  children: ReactNode;
}

interface AccordionProps {
  items?: AccordionItemData[];
  children?: ReactNode;
  allowMultipleOpen?: boolean;
}

interface AccordionItemComponent extends React.FunctionComponent<AccordionItemProps> {
  displayName?: string;
}

function AccordionItem({ title, children }: AccordionItemProps): React.JSX.Element {
  // This is just a placeholder component for type checking
  // The actual rendering is handled by the parent Accordion
  return <>{children}</>;
}

function Accordion({ items, children, allowMultipleOpen = false }: AccordionProps): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  // Support both items prop and children patterns
  const useItemsProp = items && items.length > 0;
  const childItems = children ? React.Children.toArray(children) : [];

  const handleToggle = (index: number) => {
    if (allowMultipleOpen) {
      const newOpenIndices = new Set(openIndices);
      if (newOpenIndices.has(index)) {
        newOpenIndices.delete(index);
      } else {
        newOpenIndices.add(index);
      }
      setOpenIndices(newOpenIndices);
    } else {
      setOpenIndex(index === openIndex ? -1 : index);
    }
  };

  const isOpen = (index: number) => {
    return allowMultipleOpen ? openIndices.has(index) : index === openIndex;
  };

  if (useItemsProp) {
    // Render from items prop
    return (
      <div className="my-4 border border-gray-200 rounded-lg overflow-hidden">
        {items && items.map((item, index) => (
          <div key={item.id} className="border-b border-gray-200 last:border-0">
            <button
              onClick={() => handleToggle(index)}
              className="w-full px-4 py-3 text-left font-semibold flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-terracotta focus-visible:ring-offset-2"
              aria-expanded={isOpen(index)}
            >
              <span>{item.title}</span>
              <svg
                className={`w-5 h-5 transition-transform ${isOpen(index) ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isOpen(index) && (
              <div className="px-4 py-3 bg-white">
                <p className="text-gray-700">{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Render from children
  return (
    <div className="my-4 border border-gray-200 rounded-lg overflow-hidden">
      {childItems.map((item, index) => {
        if (!React.isValidElement(item)) return null;

        const itemProps = item.props as AccordionItemProps;
        const itemType = item.type as AccordionItemComponent;
        const isAccordionItem =
          itemType?.displayName === "AccordionItem" ||
          itemType?.name === "AccordionItem" ||
          itemProps.title;

        if (!isAccordionItem) return null;

        return (
          <div key={index} className="border-b border-gray-200 last:border-0">
            <button
              onClick={() => handleToggle(index)}
              className="w-full px-4 py-3 text-left font-semibold flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-terracotta focus-visible:ring-offset-2"
              aria-expanded={isOpen(index)}
            >
              <span>{itemProps.title}</span>
              <svg
                className={`w-5 h-5 transition-transform ${isOpen(index) ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isOpen(index) && (
              <div className="px-4 py-3 bg-white">
                {itemProps.children}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

Accordion.Item = AccordionItem as AccordionItemComponent;
AccordionItem.displayName = "AccordionItem";

export default Accordion;
export { AccordionItem };
