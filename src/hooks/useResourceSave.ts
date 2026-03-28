/**
 * useResourceSave - Hook for managing resource save/bookmark state
 *
 * Handles saving resources with localStorage fallback
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { toggleSave } from "@/services/resourceService";
import { clientLogger } from "@/lib/client-logger";

const STORAGE_KEY = "saved-resources";

export function useResourceSave() {
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Load saved resources from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const saved = JSON.parse(stored) as string[];
        setSavedResources(new Set(saved));
      }
    } catch (error) {
      clientLogger.error("Failed to load saved resources", {});
    }
  }, []);

  /**
   * Check if a resource is saved
   */
  const isSaved = useCallback(
    (resourceId: string) => {
      return savedResources.has(resourceId);
    },
    [savedResources],
  );

  /**
   * Toggle save state for a resource
   */
  const toggleSaveState = useCallback(
    async (resourceId: string) => {
      setIsLoading(true);

      try {
        // Optimistic update
        const newSaved = new Set(savedResources);
        const wasSaved = newSaved.has(resourceId);

        if (wasSaved) {
          newSaved.delete(resourceId);
        } else {
          newSaved.add(resourceId);
        }

        setSavedResources(newSaved);

        // Persist to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSaved)));

        // Call API (fire and forget for now)
        await toggleSave(resourceId);

        return !wasSaved;
      } catch (error) {
        clientLogger.error("Failed to save resource", { resourceId });

        // Revert on error
        const reverted = new Set(savedResources);
        setSavedResources(reverted);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(reverted)));

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [savedResources],
  );

  /**
   * Get all saved resources
   */
  const getAllSaved = useCallback(() => {
    return Array.from(savedResources);
  }, [savedResources]);

  return {
    savedResources,
    isSaved,
    toggleSave: toggleSaveState,
    getAllSaved,
    isLoading,
  };
}
