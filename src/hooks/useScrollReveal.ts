"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", once = true } = options;
  const ref = useRef<T>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          if (once) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    [once]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    // Observe all children with .reveal-text class, or the element itself
    const revealElements = element.querySelectorAll(".reveal-text");
    if (revealElements.length > 0) {
      revealElements.forEach((el) => observer.observe(el));
    } else {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [handleIntersect, threshold, rootMargin]);

  return ref;
}
