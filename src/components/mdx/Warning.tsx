import React from "react";

interface WarningProps {
  title?: string;
  message: string;
  children?: React.ReactNode;
}

export default function Warning({ title, message, children }: WarningProps) {
  return (
    <div
      className="my-6 p-4 rounded-lg border-l-4 bg-red-50 dark:bg-red-900/20 border-red-500"
      role="alert"
    >
      {title && (
        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">
          {title}
        </h4>
      )}
      <p className="text-red-700 dark:text-red-300 text-sm">
        {message}
      </p>
      {children && (
        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
          {children}
        </div>
      )}
    </div>
  );
}
