"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Mail, Download, CheckCircle2 } from "lucide-react";
import { Resource } from "@/types/resources";

const downloadSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
});

type DownloadFormData = z.infer<typeof downloadSchema>;

type Props = {
  resource: Resource;
  onClose: () => void;
};

export default function DownloadModal({ resource, onClose }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadSchema),
  });

  const onSubmit = async () => {
    setStatus("submitting");
    // Simulate API call for lead gen (e.g. sending to Resend/HubSpot)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus("success");
    
    // Auto-trigger download (mock)
    setTimeout(() => {
      const resourceUrl = `/resources/${resource.category}/${resource.slug}`;
      window.location.href = resourceUrl;
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md relative rounded-2xl shadow-2xl p-8"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          style={{ color: "var(--foreground)" }}
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--heading)" }}>
              Check your inbox!
            </h3>
            <p style={{ color: "var(--foreground)" }}>
              We&apos;ve also started the download for <strong>{resource.title}</strong> automatically.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <div className="inline-flex justify-center mb-4 p-4 rounded-xl" style={{ backgroundColor: "var(--surface-alt)" }}>
                {resource.icon && <resource.icon className="w-12 h-12" style={{ color: "var(--accent)" }} />}
              </div>
              <h3 className="font-[family-name:var(--font-poppins)] font-bold text-2xl mb-2" style={{ color: "var(--heading)" }}>
                Get the {resource.type}
              </h3>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                Enter your details to download <strong>{resource.title}</strong> and join my weekly leadership newsletter.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--heading)" }}>
                  First Name
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                  style={{ 
                    backgroundColor: "var(--background)", 
                    borderColor: errors.firstName ? "ef4444" : "var(--border)",
                    color: "var(--heading)"
                  }}
                  placeholder="Jane"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--heading)" }}>
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 opacity-40" />
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                    style={{ 
                      backgroundColor: "var(--background)", 
                      borderColor: errors.email ? "ef4444" : "var(--border)",
                      color: "var(--heading)"
                    }}
                    placeholder="jane@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 mt-2 rounded-xl font-bold flex items-center justify-center text-white transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {status === "submitting" ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Send me the {resource.type}
                  </span>
                )}
              </button>
              
              <p className="text-center text-xs mt-4 opacity-70" style={{ color: "var(--foreground)" }}>
                100% free. No spam. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
