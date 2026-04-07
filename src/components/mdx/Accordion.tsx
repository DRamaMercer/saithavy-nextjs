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
  /** Alias for allowMultipleOpen */
  allowMultiple?: boolean;
  /** Index(es) open by default */
  defaultOpen?: number | number[];
  /** Visual style variant */
  variant?: 'default' | 'bordered' | 'separated' | 'minimal';
  /** Chevron placement */
  iconPosition?: 'left' | 'right';
  /** Padding size */
  size?: 'sm' | 'md' | 'lg';
  /** Smooth transitions */
  animated?: boolean;
  /** Extra CSS classes */
  className?: string;
}

interface AccordionItemComponent extends React.FunctionComponent<AccordionItemProps> {
  displayName?: string;
}

function AccordionItem({ title: _title, children }: AccordionItemProps): React.JSX.Element {
  // This is just a placeholder component for type checking
  // The actual rendering is handled by the parent Accordion
  return <>{children}</>;
}

const sizeClasses = {
  sm: { button: 'px-3 py-2 text-sm', panel: 'px-3 py-2 text-sm' },
  md: { button: 'px-4 py-3', panel: 'px-4 py-3' },
  lg: { button: 'px-5 py-4 text-lg', panel: 'px-5 py-4 text-base' },
};

function resolveDefaultOpen(defaultOpen: number | number[] | undefined): Set<number> {
  if (defaultOpen === undefined) return new Set([0]); // Default: first item open
  if (Array.isArray(defaultOpen)) return new Set(defaultOpen);
  return new Set([defaultOpen]);
}

function Accordion({
  items,
  children,
  allowMultipleOpen = false,
  allowMultiple,
  defaultOpen,
  variant = 'default',
  iconPosition = 'right',
  size = 'md',
  animated = true,
  className = '',
}: AccordionProps): React.JSX.Element {
  const multipleOpen = allowMultiple ?? allowMultipleOpen;
  const initialOpen = resolveDefaultOpen(defaultOpen);

  const [openIndex, setOpenIndex] = useState<number>(() => {
    if (multipleOpen) return -1;
    return initialOpen.size > 0 ? [...initialOpen][0] : -1;
  });
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => {
    if (multipleOpen) return initialOpen;
    return new Set();
  });

  // Support both items prop and children patterns
  const useItemsProp = items && items.length > 0;
  const childItems = children ? React.Children.toArray(children) : [];

  const handleToggle = (index: number) => {
    if (multipleOpen) {
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
    return multipleOpen ? openIndices.has(index) : index === openIndex;
  };

  const sz = sizeClasses[size];
  const transition = animated ? 'transition-all duration-200 ease-in-out' : '';

  // Variant-based container styles
  const containerBase = `my-4 overflow-hidden ${className}`;
  const variantStyles: Record<string, string> = {
    default: `${containerBase} rounded-lg`,
    bordered: `${containerBase} rounded-lg border`,
    separated: `${containerBase}`,
    minimal: `${containerBase}`,
  };

  const itemBorderStyles: Record<string, (index: number, total: number) => string> = {
    default: (index, total) => {
      const isFirst = index === 0;
      const isLast = index === total - 1;
      const classes = [''];
      if (!isLast) classes.push('border-b');
      if (isFirst) classes.push('rounded-t-lg');
      if (isLast) classes.push('rounded-b-lg');
      return classes.join(' ');
    },
    bordered: () => 'border-b last:border-b-0',
    separated: () => 'mb-2 rounded-lg border last:mb-0',
    minimal: () => 'border-b last:border-b-0',
  };

  const buttonStyles: Record<string, string> = {
    default: `${sz.button} text-left font-semibold flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${transition}`,
    bordered: `${sz.button} text-left font-semibold flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${transition}`,
    separated: `${sz.button} text-left font-semibold flex items-center justify-between rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${transition}`,
    minimal: `${sz.button} text-left font-semibold flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${transition}`,
  };

  const iconSvg = (open: boolean) => (
    <svg
      className={`w-5 h-5 flex-shrink-0 ${transition} ${open ? 'rotate-180' : ''}`}
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
  );

  const totalItems = useItemsProp ? (items?.length ?? 0) : childItems.length;

  const renderPanel = (content: ReactNode, index: number) => {
    const open = isOpen(index);
    if (!open) return null;
    return (
      <div
        className={`${sz.panel} ${animated ? 'animate-accordion-open' : ''}`}
        style={{
          color: 'var(--foreground)',
          background: 'var(--background)',
        }}
      >
        {content}
      </div>
    );
  };

  if (useItemsProp) {
    return (
      <div
        className={variantStyles[variant]}
        style={
          variant === 'bordered' || variant === 'separated'
            ? { borderColor: 'var(--border)' }
            : undefined
        }
      >
        {items && items.map((item, index) => (
          <div
            key={item.id}
            className={itemBorderStyles[variant](index, totalItems)}
            style={
              variant === 'separated' || (variant === 'default' && index < totalItems - 1)
                ? { borderColor: 'var(--border)' }
                : variant === 'bordered'
                  ? { borderColor: 'var(--border)' }
                  : undefined
            }
          >
            <button
              onClick={() => handleToggle(index)}
              className={buttonStyles[variant]}
              style={{
                color: 'var(--heading)',
                background: isOpen(index) ? 'var(--surface)' : 'var(--background)',
              }}
              aria-expanded={isOpen(index)}
            >
              {iconPosition === 'left' && iconSvg(isOpen(index))}
              <span className={iconPosition === 'left' ? 'ml-2' : ''}>{item.title}</span>
              {iconPosition === 'right' && iconSvg(isOpen(index))}
            </button>
            {renderPanel(<p>{item.content}</p>, index)}
          </div>
        ))}
      </div>
    );
  }

  // Render from children
  return (
    <div
      className={variantStyles[variant]}
      style={
        variant === 'bordered' || variant === 'separated'
          ? { borderColor: 'var(--border)' }
          : undefined
      }
    >
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
          <div
            key={index}
            className={itemBorderStyles[variant](index, totalItems)}
            style={
              variant === 'separated' || (variant === 'default' && index < totalItems - 1)
                ? { borderColor: 'var(--border)' }
                : variant === 'bordered'
                  ? { borderColor: 'var(--border)' }
                  : undefined
            }
          >
            <button
              onClick={() => handleToggle(index)}
              className={buttonStyles[variant]}
              style={{
                color: 'var(--heading)',
                background: isOpen(index) ? 'var(--surface)' : 'var(--background)',
              }}
              aria-expanded={isOpen(index)}
            >
              {iconPosition === 'left' && iconSvg(isOpen(index))}
              <span className={iconPosition === 'left' ? 'ml-2' : ''}>{itemProps.title}</span>
              {iconPosition === 'right' && iconSvg(isOpen(index))}
            </button>
            {renderPanel(itemProps.children, index)}
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
