import React, { useState } from 'react';
import { Check, Mail } from 'lucide-react';
import { Button, Input } from './ui';
import { trackEmailSignup } from '../lib/analytics';

interface LeadCaptureFormProps {
  source: string;
  resourceId?: string;
  variant?: 'inline' | 'popup' | 'inline-compact';
  buttonText?: string;
  placeholder?: string;
  onSuccess?: () => void;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  source,
  resourceId,
  variant = 'inline',
  buttonText = 'Get Free Access',
  placeholder = 'Enter your email',
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Track the signup
      trackEmailSignup(source, resourceId);
      
      setIsSubmitted(true);
      onSuccess?.();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center animate-fade-in">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <Check className="text-green-500" size={20} />
        </div>
        <p className="text-green-800 font-medium">You're subscribed!</p>
        <p className="text-green-600 text-sm">Check your inbox for next steps.</p>
      </div>
    );
  }

  if (variant === 'inline-compact') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          className="flex-1"
        />
        <Button 
          type="submit" 
          isLoading={isLoading}
          variant="primary"
        >
          {buttonText}
        </Button>
      </form>
    );
  }

  if (variant === 'popup') {
    return (
      <div className="bg-gradient-to-r from-[#1B263B] to-[#2D3A50] text-white rounded-xl p-8 text-center">
        <Mail className="w-12 h-12 mx-auto mb-4 text-[#E07A5F]" />
        <h3 className="text-2xl font-bold mb-2 font-poppins">
          Unlock This Resource
        </h3>
        <p className="text-white/80 mb-6">
          Enter your email to access this free resource and get updates on similar tools.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <Button 
            type="submit" 
            isLoading={isLoading}
            variant="primary"
            className="w-full"
          >
            {buttonText}
          </Button>
        </form>
        <p className="text-white/60 text-xs mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Default inline variant
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          leftIcon={<Mail size={18} />}
          className="flex-1"
        />
        <Button 
          type="submit" 
          isLoading={isLoading}
          variant="primary"
        >
          {buttonText}
        </Button>
      </div>
      <p className="text-xs text-[#5E6472]">
        No spam, ever. Unsubscribe anytime.
      </p>
    </form>
  );
};

export default LeadCaptureForm;
