import React, { ReactNode } from "react";

interface StepGuideStepProps {
  title: string;
  content: ReactNode | string;
  estimatedTime?: string;
}

/**
 * StepGuideStep component for individual step guide steps.
 *
 * Note: The current StepGuide component implementation uses a steps array prop,
 * but this component is provided for alternative usage patterns or future enhancements.
 *
 * Current usage:
 * <StepGuide steps={[{ title: 'Step 1', content: 'Description', estimatedTime: '5 min' }]} />
 *
 * Alternative usage (if needed):
 * <StepGuide>
 *   <StepGuideStep title="Step 1" content="Description" estimatedTime="5 min" />
 * </StepGuide>
 */
export default function StepGuideStep({
  title,
  content,
  estimatedTime,
}: StepGuideStepProps): React.JSX.Element {
  // This component is a simple wrapper - the actual rendering is handled by the parent StepGuide component
  return <>{content}</>;
}
