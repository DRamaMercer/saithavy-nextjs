/**
 * Share Client Component
 *
 * Client-side component for social media sharing
 * Gets current URL from window.location
 */

"use client";

import { useEffect, useState } from "react";
import { Resource } from "@/types/resources";
import SocialShareButtons from "@/components/SocialShareButtons";

interface ShareClientProps {
  resource: Resource;
  category: string;
  slug: string;
}

export default function ShareClient({
  resource,
  category: _category,
  slug: _slug,
}: ShareClientProps) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Get current URL on client side
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Safe: initializing state from window on mount
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Don't render until we have the URL
  if (!currentUrl) {
    return null;
  }

  return (
    <SocialShareButtons
      title={resource.title}
      description={resource.description}
      url={currentUrl}
    />
  );
}
