import React, { ReactNode } from "react";

interface TabProps {
  label: string;
  children: ReactNode;
}

/**
 * Tab component for use within Tabs component.
 * This is a wrapper component that stores the label prop for the parent Tabs component to read.
 * The actual rendering is handled by the parent Tabs component.
 *
 * Usage:
 * <Tabs>
 *   <Tab label="Tab 1">Content 1</Tab>
 *   <Tab label="Tab 2">Content 2</Tab>
 * </Tabs>
 */
export default function Tab({ children }: TabProps): React.JSX.Element {
  // The parent Tabs component reads the label prop directly from this component's props
  // and handles the actual rendering. We just return the children here.
  return <>{children}</>;
}
