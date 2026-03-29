"use client";

import React, { ReactNode } from "react";

interface Step {
  title: string;
  content: string;
  estimatedTime?: string;
}

interface StepGuideProps {
  title: string;
  description?: string;
  steps?: Step[];
  children?: ReactNode;
}

interface StepGuideStepProps {
  title: string;
  children: ReactNode;
  estimatedTime?: string;
}

export default function StepGuide({
  title,
  description,
  steps,
  children,
}: StepGuideProps): React.JSX.Element {
  // Support both steps prop and children pattern
  const useChildren = !steps && React.Children.count(children) > 0;
  const childSteps = useChildren ? React.Children.toArray(children) : [];

  return (
    <div className="my-6 p-6 rounded-lg border border-gray-200 bg-white">
      <h4 className="font-semibold text-lg mb-2 text-gray-900">{title}</h4>
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      <ol className="space-y-4">
        {(steps || childSteps).map((step, index) => {
          // Handle both Step objects and StepGuideStep components
          if (React.isValidElement(step)) {
            const stepProps = step.props as StepGuideStepProps;
            return (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blueprint-terracotta text-white font-semibold text-sm">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-1">{stepProps.title}</h5>
                  <div className="text-sm text-gray-600 mb-1">{stepProps.children}</div>
                  {stepProps.estimatedTime && (
                    <span className="text-xs text-gray-500 italic">
                      ⏱ {stepProps.estimatedTime}
                    </span>
                  )}
                </div>
              </li>
            );
          }

          // Handle Step object
          const stepObj = step as Step;
          return (
            <li key={index} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blueprint-terracotta text-white font-semibold text-sm">
                {index + 1}
              </span>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 mb-1">{stepObj.title}</h5>
                <p className="text-sm text-gray-600 mb-1">{stepObj.content}</p>
                {stepObj.estimatedTime && (
                  <span className="text-xs text-gray-500 italic">
                    ⏱ {stepObj.estimatedTime}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function StepGuideStep({
  title,
  children,
  estimatedTime,
}: StepGuideStepProps): React.JSX.Element {
  // This is just a placeholder component for type checking
  // The actual rendering is handled by the parent StepGuide
  return <>{children}</>;
}
