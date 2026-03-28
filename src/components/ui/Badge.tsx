import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'pdf' | 'template' | 'guide' | 'audio' | 'video' | 'checklist';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  size = 'sm',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-[#E07A5F] text-white',
    secondary: 'bg-[#1B263B] text-white',
    accent: 'bg-[#A8DADC] text-[#1B263B]',
    pdf: 'bg-[#E07A5F] text-white',
    template: 'bg-[#F4A261] text-[#1B263B]',
    guide: 'bg-[#A8DADC] text-[#1B263B]',
    audio: 'bg-[#6D28D9] text-white',
    video: 'bg-[#1B263B] text-white',
    checklist: 'bg-[#5E6472] text-white'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const variantKey = variant as keyof typeof variants;
  
  return (
    <span 
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variantKey] || variants.default}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
