import React from "react";

interface CalloutProps {
  type?: "info" | "warning" | "tip" | "success" | "error";
  title?: string;
  children: React.ReactNode;
}

const styles = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  tip: "bg-green-50 border-green-200 text-green-800",
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
};

export default function Callout({
  type = "info",
  title,
  children,
}: CalloutProps): React.JSX.Element {
  return (
    <div
      className={`my-6 p-4 rounded-lg border-l-4 ${styles[type]}`}
      role="alert"
    >
      {title && (
        <div className="font-semibold mb-2">{title}</div>
      )}
      <div className="prose prose-sm max-w-none">{children}</div>
    </div>
  );
}
