import React from "react";

interface ChecklistItemProps {
  id: string;
  text: string;
  checked?: boolean;
}

/**
 * ChecklistItem component for individual checklist items.
 *
 * Note: The current Checklist component implementation uses an items array prop,
 * but this component is provided for alternative usage patterns or future enhancements.
 *
 * Current usage:
 * <Checklist items={[{ id: '1', text: 'Item', checked: false }]} />
 *
 * Alternative usage (if needed):
 * <Checklist>
 *   <ChecklistItem id="1" text="Item" checked={false} />
 * </Checklist>
 */
export default function ChecklistItem({
  id: _id,
  text,
  checked: _checked = false,
}: ChecklistItemProps): React.JSX.Element {
  // This component is a simple wrapper - the actual rendering is handled by the parent Checklist component
  return <>{text}</>;
}
