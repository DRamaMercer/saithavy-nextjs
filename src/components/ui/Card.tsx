import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

function Card({
  children,
  className = "",
  hover = true,
  padding = "md",
  onClick,
  role,
  tabIndex,
  ...props
}: CardProps): React.JSX.Element {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-md overflow-hidden focus-visible:ring-2 focus-visible:ring-blueprint-terracotta focus-visible:ring-offset-2
        ${hover ? "transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl" : ""}
        ${paddingStyles[padding]}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
      role={role || (onClick ? "button" : undefined)}
      tabIndex={tabIndex !== undefined ? tabIndex : (onClick ? 0 : undefined)}
      onKeyDown={onClick ? handleKeyDown : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
export { Card };
