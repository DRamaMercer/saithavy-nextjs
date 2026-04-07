"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Mail, Download, CheckCircle2 } from "lucide-react";
import { Resource } from "@/types/resources";
import { FocusTrap } from "focus-trap-react";

const downloadSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  email: z.string().email("Invalid email address."),
});

type DownloadFormData = z.infer<typeof downloadSchema>;

type Props = {
  resource: Resource;
  onClose: () => void;
};

function DownloadModal({ resource, onClose }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadSchema),
  });

  // Focus trap using focus-trap-react library
  // Note: FocusTrap component wraps the modal content in the JSX

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const onSubmit = useCallback(async () => {
    setStatus("submitting");
    // Simulate API call for lead gen (e.g. sending to Resend/HubSpot)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");

    // Auto-trigger download (mock)
    setTimeout(() => {
      const resourceUrl = `/resources/${resource.category}/${resource.slug}`;
      window.location.href = resourceUrl;
    }, 1500);
  }, [resource.category, resource.slug]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${resource.id}`}
    >
      <FocusTrap
        active={true}
        focusTrapOptions={{
          initialFocus: false,
          clickOutsideDeactivates: true,
          onPostActivate: () => closeButtonRef.current?.focus(),
        }}
      >
        <div
          ref={modalRef}
          className="w-full max-w-md relative rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200"
          style={{ backgroundColor: "var(--surface)" }}
          onClick={handleModalClick}
        >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          style={{ color: "var(--foreground)" }}
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {status === "success" ? (
          <div className="text-center py-8 animate-in fade-in duration-300" role="status" aria-live="polite">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-500" aria-hidden="true" />
            <h3
              id={`modal-title-${resource.id}`}
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--heading)" }}
            >
              Check your inbox!
            </h3>
            <p style={{ color: "var(--foreground)" }}>
              We&apos;ve also started the download for{" "}
              <strong>{resource.title}</strong> automatically.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <div
                className="inline-flex justify-center mb-4 p-4 rounded-xl"
                style={{ backgroundColor: "var(--surface-alt)" }}
                aria-hidden="true"
              >
                {resource.icon && (
                  <resource.icon
                    className="w-12 h-12"
                    style={{ color: "var(--accent)" }}
                  />
                )}
              </div>
              <h3
                id={`modal-title-${resource.id}`}
                className="font-(family-name:--font-poppins) font-bold text-2xl mb-2"
                style={{ color: "var(--heading)" }}
              >
                Get the {resource.type}
              </h3>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                Enter your details to download <strong>{resource.title}</strong>{" "}
                and join my weekly leadership newsletter.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--heading)" }}
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register("firstName")}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none focus:ring-amber-500 transition-all"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: errors.firstName ? "#ef4444" : "var(--border)",
                    color: "var(--heading)",
                  }}
                  placeholder="Jane"
                  aria-invalid={errors.firstName ? "true" : "false"}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="mt-1 text-xs text-red-500" role="alert">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--heading)" }}
                >
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 opacity-40" aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none focus:ring-amber-500 transition-all"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: errors.email ? "#ef4444" : "var(--border)",
                      color: "var(--heading)",
                    }}
                    placeholder="jane@company.com"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-500" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 mt-2 rounded-xl font-bold flex items-center justify-center text-white transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {status === "submitting" ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Download className="w-5 h-5" aria-hidden="true" />
                    <span>Send me the {resource.type}</span>
                  </span>
                )}
              </button>

              <p
                className="text-center text-xs mt-4 opacity-70"
                style={{ color: "var(--foreground)" }}
              >
                100% free. No spam. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
        </div>
      </FocusTrap>
    </div>
  );
}

export default DownloadModal;
