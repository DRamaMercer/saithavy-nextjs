"use client";

import React, { ReactNode } from "react";

interface Step {
  title: string;
  content?: string;
  /** Alias for content (many blog posts use this) */
  description?: string;
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  status?: 'pending' | 'active' | 'complete' | 'error';
  tip?: string;
  warning?: string;
  code?: string;
}

interface StepGuideProps {
  title: string;
  description?: string;
  steps?: Step[];
  children?: ReactNode;
  /** Visual style variant */
  variant?: 'numbered' | 'connected' | 'timeline' | 'cards';
  /** Layout orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Show progress indicator */
  showProgress?: boolean;
  /** Currently active step index */
  activeStep?: number;
  /** Extra CSS classes */
  className?: string;
}

interface StepGuideStepProps {
  title: string;
  children: ReactNode;
  estimatedTime?: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  status?: 'pending' | 'active' | 'complete' | 'error';
  tip?: string;
  warning?: string;
  code?: string;
}

const difficultyBadge = (difficulty: string) => {
  const colors: Record<string, string> = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[difficulty] || ''}`}>
      {difficulty}
    </span>
  );
};

const statusIndicator = (status: string) => {
  const indicators: Record<string, { icon: string; color: string }> = {
    pending: { icon: '\u25CB', color: 'text-gray-400' },
    active: { icon: '\u25CF', color: 'text-blue-500' },
    complete: { icon: '\u2713', color: 'text-green-500' },
    error: { icon: '\u2717', color: 'text-red-500' },
  };
  const s = indicators[status] || indicators.pending;
  return <span className={`${s.color} font-bold mr-2`}>{s.icon}</span>;
};

function getStepBody(step: Step | StepGuideStepProps): ReactNode {
  // For Step objects, prefer description, then content
  if ('description' in step && step.description) return step.description;
  if ('content' in step && step.content) return step.content;
  // For children-based steps
  if ('children' in step) return step.children;
  return null;
}

export default function StepGuide({
  title,
  description,
  steps,
  children,
  variant = 'numbered',
  orientation = 'vertical',
  showProgress = false,
  activeStep,
  className = '',
}: StepGuideProps): React.JSX.Element {
  // Support both steps prop and children pattern
  const useChildren = !steps && React.Children.count(children) > 0;
  const childSteps = useChildren ? React.Children.toArray(children) : [];
  const allSteps = steps || [];
  const total = useChildren ? childSteps.length : allSteps.length;

  const stepNumberClasses: Record<string, string> = {
    numbered:
      'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold text-sm',
    connected:
      'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold text-sm',
    timeline:
      'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold text-sm border-2',
    cards: 'hidden',
  };

  const listContainerClass =
    orientation === 'horizontal'
      ? 'flex gap-6 overflow-x-auto'
      : 'space-y-4';

  const stepItemClass: Record<string, string> = {
    numbered: 'flex gap-4',
    connected: 'flex gap-4 relative',
    timeline: 'flex gap-4 relative pl-8',
    cards: '',
  };

  const renderStepContent = (
    stepBody: ReactNode,
    stepObj: Step | StepGuideStepProps,
    index: number
  ) => {
    const isActive = activeStep !== undefined && activeStep === index;
    const cardWrapper = variant === 'cards';

    const inner = (
      <>
        {stepObj.title && (
          <h5
            className="font-semibold mb-1 flex items-center gap-2"
            style={{ color: 'var(--heading)' }}
          >
            {stepObj.status && statusIndicator(stepObj.status)}
            {stepObj.title}
            {'difficulty' in stepObj && stepObj.difficulty && difficultyBadge(stepObj.difficulty)}
          </h5>
        )}
        <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>
          {stepBody}
        </div>
        {stepObj.estimatedTime && (
          <span className="text-xs italic" style={{ color: 'var(--muted)' }}>
            Estimated: {stepObj.estimatedTime}
          </span>
        )}
        {'tip' in stepObj && stepObj.tip && (
          <div
            className="mt-2 p-3 rounded-md text-sm border-l-4"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--accent)',
              color: 'var(--foreground)',
            }}
          >
            <strong>Tip:</strong> {stepObj.tip}
          </div>
        )}
        {'warning' in stepObj && stepObj.warning && (
          <div
            className="mt-2 p-3 rounded-md text-sm border-l-4"
            style={{
              background: 'var(--surface)',
              borderColor: '#eab308',
              color: 'var(--foreground)',
            }}
          >
            <strong>Warning:</strong> {stepObj.warning}
          </div>
        )}
        {'code' in stepObj && stepObj.code && (
          <pre
            className="mt-2 p-3 rounded-md text-sm overflow-x-auto"
            style={{
              background: 'var(--surface)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            }}
          >
            <code>{stepObj.code}</code>
          </pre>
        )}
      </>
    );

    if (cardWrapper) {
      return (
        <div
          className={`p-4 rounded-lg border ${isActive ? 'ring-2' : ''}`}
          style={{
            background: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="text-xs font-semibold mb-2 px-2 py-0.5 rounded inline-block"
            style={{ background: 'var(--accent)', color: 'var(--background)' }}
          >
            Step {index + 1}
          </div>
          {inner}
        </div>
      );
    }

    return (
      <div className="flex-1">
        {inner}
      </div>
    );
  };

  const renderProgressBar = () => {
    if (!showProgress) return null;
    const completed = allSteps.filter(
      (s) => s.status === 'complete'
    ).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return (
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted)' }}>
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ background: 'var(--surface)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: 'var(--accent)' }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`my-6 p-6 rounded-lg ${className}`}
      style={{
        background: 'var(--background)',
        border: '1px solid var(--border)',
      }}
    >
      <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--heading)' }}>
        {title}
      </h4>
      {description && (
        <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
          {description}
        </p>
      )}
      {renderProgressBar()}
      {variant === 'cards' ? (
        <div className={`grid gap-4 ${orientation === 'horizontal' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
          {(useChildren ? childSteps : allSteps).map((step, index) => {
            if (React.isValidElement(step)) {
              const stepProps = step.props as StepGuideStepProps;
              const stepBody = getStepBody(stepProps);
              return (
                <div key={index}>
                  {renderStepContent(stepBody, stepProps, index)}
                </div>
              );
            }
            const stepObj = step as Step;
            const stepBody = getStepBody(stepObj);
            return (
              <div key={index}>
                {renderStepContent(stepBody, stepObj, index)}
              </div>
            );
          })}
        </div>
      ) : (
        <ol className={listContainerClass}>
          {(useChildren ? childSteps : allSteps).map((step, index) => {
            if (React.isValidElement(step)) {
              const stepProps = step.props as StepGuideStepProps;
              const stepBody = getStepBody(stepProps);
              const isActive = activeStep !== undefined && activeStep === index;
              return (
                <li key={index} className={stepItemClass[variant]}>
                  <span
                    className={stepNumberClasses[variant]}
                    style={{
                      background: 'var(--accent)',
                      ...(variant === 'timeline' ? { borderColor: 'var(--accent)' } : {}),
                    }}
                  >
                    {stepProps.status === 'complete' ? '\u2713' : index + 1}
                  </span>
                  {renderStepContent(stepBody, stepProps, index)}
                </li>
              );
            }

            const stepObj = step as Step;
            const stepBody = getStepBody(stepObj);
            return (
              <li key={index} className={stepItemClass[variant]}>
                <span
                  className={stepNumberClasses[variant]}
                  style={{
                    background: stepObj.status === 'complete' ? '#22c55e' : 'var(--accent)',
                    ...(variant === 'timeline' ? { borderColor: 'var(--accent)' } : {}),
                  }}
                >
                  {stepObj.status === 'complete' ? '\u2713' : index + 1}
                </span>
                {renderStepContent(stepBody, stepObj, index)}
              </li>
            );
          })}
        </ol>
      )}
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

StepGuide.Step = StepGuideStep;
