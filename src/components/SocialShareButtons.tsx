"use client";

import React, { useState } from "react";
import { Twitter, Linkedin, Facebook, Link2, Check } from "lucide-react";
import { clientLogger } from "@/lib/client-logger";

interface SocialShareButtonsProps {
  title: string;
  description: string;
  url: string;
}

// Social button component (defined outside render to avoid recreation)
interface SocialButtonProps {
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  bgColor: string;
  hoverColor: string;
  onClick?: () => void;
}

function SocialButton({
  href,
  icon: Icon,
  label,
  bgColor,
  hoverColor,
  onClick,
}: SocialButtonProps) {
  const ButtonWrapper = href ? "a" : "button";

  return (
    <div className="relative group">
      <ButtonWrapper
        href={href}
        onClick={onClick}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full
          transition-all duration-300 transform
          hover:scale-110 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] [button]:cursor-pointer
          ${bgColor} ${hoverColor}
          ${!href ? "cursor-pointer" : ""}
        `}
        aria-label={label}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
      >
        <Icon className="w-5 h-5" />
      </ButtonWrapper>

      {/* Tooltip */}
      <div
        className={`
        absolute left-1/2 -translate-x-1/2 -top-10
        px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        pointer-events-none whitespace-nowrap
        shadow-lg
      `}
      >
        {label}
        {/* Arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </div>
  );
}

/**
 * SocialShareButtons Component
 *
 * Provides social media sharing functionality with:
 * - Twitter/X, LinkedIn, Facebook sharing
 * - Copy link to clipboard with visual feedback
 * - Accessible button design with tooltips
 * - Brand color hover effects
 */
export default function SocialShareButtons({
  title,
  description,
  url,
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Encode URL and text for social media platforms
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  // Social media share URLs
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDesc}`,
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowToast(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    } catch (error) {
      clientLogger.error(
        "Failed to copy URL to clipboard",
        { component: "SocialShareButtons", url },
      );
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`
          fixed bottom-6 right-6 z-50
          flex items-center gap-3 px-4 py-3
          bg-linear-gradient-to-br from-blueprint-emerald to-blueprint-sage
          text-white rounded-xl shadow-2xl
          animate-in slide-in-from-bottom-2 duration-300
        `}
        >
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <span className="font-medium">Link copied to clipboard!</span>
        </div>
      )}

      {/* Share Buttons */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-sm font-medium text-[var(--foreground)]">
          Share:
        </span>

        {/* Twitter/X */}
        <SocialButton
          href={shareUrls.twitter}
          icon={Twitter}
          label="Share on X"
          bgColor="bg-white border border-[var(--border)] text-gray-700"
          hoverColor="hover:bg-black hover:text-white hover:border-black"
        />

        {/* Facebook */}
        <SocialButton
          href={shareUrls.facebook}
          icon={Facebook}
          label="Share on Facebook"
          bgColor="bg-white border border-[var(--border)] text-gray-700"
          hoverColor="hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
        />

        {/* LinkedIn */}
        <SocialButton
          href={shareUrls.linkedin}
          icon={Linkedin}
          label="Share on LinkedIn"
          bgColor="bg-white border border-[var(--border)] text-gray-700"
          hoverColor="hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]"
        />

        {/* Copy Link */}
        <SocialButton
          icon={copied ? Check : Link2}
          label={copied ? "Copied!" : "Copy link"}
          bgColor={
            copied
              ? "bg-gradient-to-r from-[var(--blueprint-emerald)] to-[var(--blueprint-sage)] text-white border-0"
              : "bg-white border border-[var(--border)] text-gray-700"
          }
          hoverColor={
            !copied
              ? "hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]"
              : ""
          }
          onClick={handleCopy}
        />
      </div>
    </>
  );
}
