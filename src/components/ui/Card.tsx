import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = true,
  padding = "md",
  onClick,
}) => {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-md overflow-hidden
        ${hover ? "transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl" : ""}
        ${paddingStyles[padding]}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
