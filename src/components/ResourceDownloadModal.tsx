/**
 * Resource Download Modal
 *
 * 3-option download system with email capture:
 * - PDF Download (print-ready format)
 * - Web Version (view in browser)
 * - Print Version (optimized for printing)
 *
 * Integrates with analytics for tracking
 */

"use client";

import React, { useState } from "react";
import { X, FileText, Globe, Printer, Check, Loader2 } from "lucide-react";
import { Resource, DownloadFormat } from "@/types/resources";
import { trackResourceDownload, trackEmailSignup } from "@/lib/analytics";
import { clientLogger } from "@/lib/client-logger";

interface ResourceDownloadModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (resource: Resource, format: DownloadFormat) => void;
}

const ResourceDownloadModal: React.FC<ResourceDownloadModalProps> = ({
  resource,
  isOpen,
  onClose,
  onDownload,
}) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleDownload = async (format: DownloadFormat) => {
    setError("");

    // For PDF downloads, require email
    if (format === "pdf") {
      if (!email.trim()) {
        setError("Please enter your email address");
        return;
      }

      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }

      setIsLoading(true);

      try {
        // Call download API with rate limiting
        const response = await fetch("/api/download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            resourceId: resource.id,
            format,
            firstName: firstName.trim() || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            setError("Too many download attempts. Please try again later.");
          } else {
            setError(data.error || "Something went wrong. Please try again.");
          }
          setIsLoading(false);
          return;
        }

        // Track email signup
        trackEmailSignup("resource_download", resource.id);

        // Track download
        trackResourceDownload(resource.id, resource.title, format);

        setIsLoading(false);
        setDownloadStarted(true);

        // Trigger download after brief delay
        setTimeout(() => {
          onDownload(resource, format);
        }, 500);
      } catch (err) {
        setIsLoading(false);
        setError("Something went wrong. Please try again.");
        clientLogger.error(
          "Download failed",
          {
            component: "ResourceDownloadModal",
            resourceId: resource.id,
            format,
          },
        );
      }
    } else {
      // For web and print, no email required
      trackResourceDownload(resource.id, resource.title, format);
      setDownloadStarted(true);
      onDownload(resource, format);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset state after close animation
      setTimeout(() => {
        setDownloadStarted(false);
        setFirstName("");
        setEmail("");
        setError("");
      }, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
          aria-label="Close download modal"
        >
          <X size={24} aria-hidden="true" />
        </button>

        {!downloadStarted ? (
          <div className="p-8">
            <h3
              id="modal-title"
              className="text-2xl font-bold text-blueprint-navy mb-2 font-poppins"
            >
              Get &quot;{resource.title}&quot;
            </h3>
            <p className="text-[#5E6472] mb-6">Choose your preferred format:</p>

            <div className="space-y-3" role="listbox">
              <button
                onClick={() => handleDownload("pdf")}
                disabled={isLoading}
                className="w-full p-4 border-2 border-[#E07A5F] rounded-lg hover:bg-[#E07A5F]/10 transition-colors flex items-center gap-3 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                role="option"
                aria-selected="false"
                aria-label={`Download ${resource.title} as PDF - Print-ready format`}
              >
                <div
                  className="w-10 h-10 rounded-lg bg-blueprint-terracotta flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <FileText className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-blueprint-navy group-hover:text-blueprint-terracotta transition-colors">
                    PDF Download
                  </div>
                  <div className="text-sm text-[#5E6472]">
                    Print-ready format
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleDownload("web")}
                disabled={isLoading}
                className="w-full p-4 border-2 border-[#A8DADC] rounded-lg hover:bg-[#A8DADC]/10 transition-colors flex items-center gap-3 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                role="option"
                aria-selected="false"
                aria-label={`View ${resource.title} web version in browser`}
              >
                <div
                  className="w-10 h-10 rounded-lg bg-blueprint-sage flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Globe className="text-[#1B263B]" size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-blueprint-navy group-hover:text-blueprint-sage transition-colors">
                    Web Version
                  </div>
                  <div className="text-sm text-[#5E6472]">View in browser</div>
                </div>
              </button>

              <button
                onClick={() => handleDownload("print")}
                disabled={isLoading}
                className="w-full p-4 border-2 border-[#F4A261] rounded-lg hover:bg-[#F4A261]/10 transition-colors flex items-center gap-3 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                role="option"
                aria-selected="false"
                aria-label={`Open ${resource.title} print version - Optimized for printing`}
              >
                <div
                  className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Printer className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#1B263B] group-hover:text-[#F4A261] transition-colors">
                    Print Version
                  </div>
                  <div className="text-sm text-[#5E6472]">
                    Optimized for printing
                  </div>
                </div>
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-[#5E6472] mb-3">
                Get updates and similar resources:
              </p>
              <div className="flex flex-col gap-2">
                <div>
                  <label htmlFor="firstName" className="sr-only">
                    First name (optional)
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="First name (optional)"
                    value={firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFirstName(e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blueprint-terracotta focus:border-transparent"
                    disabled={isLoading}
                    aria-invalid={false}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address (required)
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blueprint-terracotta focus:border-transparent"
                    disabled={isLoading}
                    required
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "email-error" : undefined}
                  />
                  {error && (
                    <span id="email-error" className="sr-only" role="alert">
                      {error}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDownload("pdf")}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-linear-gradient-to-r from-blueprint-terracotta to-orange-500 text-white font-semibold rounded-lg hover:from-[#D0694E] hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Subscribe & Download"
                  )}
                </button>
              </div>
              <p className="text-xs text-[#5E6472] mt-2 text-center">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-blueprint-navy mb-2">
              Your download is starting!
            </h3>
            <p className="text-[#5E6472] mb-6">Check your downloads folder.</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDownloadModal;
