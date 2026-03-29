/**
 * EmailCaptureForm Component
 * Email capture form with validation and API integration
 */

"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { clientLogger } from "@/lib/client-logger";

interface EmailCaptureFormProps {
  leadMagnet: string;
  buttonText?: string;
  redirectPath?: string;
}

export default function EmailCaptureForm({
  leadMagnet,
  buttonText = "Download Now - Free",
  redirectPath = "/resources",
}: EmailCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use real backend API
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          lead_magnet: leadMagnet,
          metadata: {
            timestamp: new Date().toISOString(),
            source: "landing-page",
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 2000);
      } else {
        clientLogger.error("Lead capture failed", {
          component: "EmailCaptureForm",
          leadMagnet,
          error: result.error,
        });
        // Still allow download even if API fails
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 2000);
      }
    } catch (error) {
      clientLogger.error(
        "Email capture request failed",
        { component: "EmailCaptureForm", leadMagnet },
      );
      // Still allow download even if there's an error
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 2000);
    }

    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="py-8">
        <div className="w-16 h-16 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white dark:text-slate-100 mb-4">
          Check Your Inbox!
        </h2>
        <p className="text-xl text-blue-200 dark:text-blue-300 mb-6">
          Your workbook is on its way. Redirecting...
        </p>
        <div className="flex justify-center gap-4">
          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your work email"
        required
        className="w-full px-6 py-4 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 bg-white dark:bg-slate-800 focus:ring-4 focus:ring-blue-200/50 dark:focus:ring-blue-900/50 focus:outline-none border-0"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-orange-600 dark:text-orange-400 font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>Sending...</>
        ) : (
          <>
            {buttonText}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
