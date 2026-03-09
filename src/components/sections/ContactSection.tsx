"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validators";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ContactSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error" | "rate-limited"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      interest: undefined,
      message: "",
      honeypot: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 429) {
        setSubmitStatus("rate-limited");
        setErrorMessage(
          `Too many submissions. Please try again in ${Math.ceil(
            (result.retryAfter || 3600) / 60
          )} minutes.`
        );
        return;
      }

      if (!response.ok) {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Something went wrong.");
        return;
      }

      setSubmitStatus("success");
      reset();

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please check your connection.");
    }
  };

  const interestOptions = [
    { value: "", label: "Select an option", disabled: true },
    { value: "ai-consulting", label: "AI Automation Consulting" },
    { value: "remote-work", label: "Remote Work Coaching" },
    { value: "content-resources", label: "Content & Resources" },
    { value: "speaking", label: "Speaking Engagement" },
    { value: "other", label: "Other" },
  ];

  return (
    <section
      id="contact"
      className="py-20"
      style={{ backgroundColor: "var(--surface)" }}
      ref={sectionRef}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="reveal-text font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-5xl mb-6"
            style={{ color: "var(--heading)" }}
          >
            Let&apos;s Connect
          </h2>
          <p className="reveal-text text-xl max-w-3xl mx-auto" style={{ color: "var(--foreground)" }}>
            Ready to transform your approach to work and life? Let&apos;s start
            the conversation about your growth journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="reveal-text">
            {/* Status Messages */}
            {submitStatus === "success" && (
              <div
                className="p-4 rounded-lg mb-6 flex items-center animate-[fadeIn_0.5s_ease]"
                style={{ backgroundColor: "var(--highlight)", color: "white" }}
              >
                <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  Thank you! Your message has been sent. I&apos;ll get back to
                  you within 24 hours.
                </span>
              </div>
            )}

            {(submitStatus === "error" || submitStatus === "rate-limited") && (
              <div className="bg-red-500 text-white p-4 rounded-lg mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot - hidden from users */}
              <div className="absolute" style={{ left: "-9999px" }} aria-hidden="true">
                <input type="text" {...register("honeypot")} tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-[family-name:var(--font-poppins)] font-semibold mb-2"
                    style={{ color: "var(--heading)" }}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    {...register("firstName")}
                    className={`form-field w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    style={{
                      borderColor: errors.firstName ? undefined : "var(--border)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-[family-name:var(--font-poppins)] font-semibold mb-2"
                    style={{ color: "var(--heading)" }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...register("lastName")}
                    className={`form-field w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    style={{
                      borderColor: errors.lastName ? undefined : "var(--border)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-[family-name:var(--font-poppins)] font-semibold mb-2"
                  style={{ color: "var(--heading)" }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`form-field w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  style={{
                    borderColor: errors.email ? undefined : "var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="interest"
                  className="block text-sm font-[family-name:var(--font-poppins)] font-semibold mb-2"
                  style={{ color: "var(--heading)" }}
                >
                  Area of Interest
                </label>
                <select
                  id="interest"
                  {...register("interest")}
                  className={`form-field w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                    errors.interest ? "border-red-500" : ""
                  }`}
                  style={{
                    borderColor: errors.interest ? undefined : "var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  defaultValue=""
                >
                  {interestOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.interest && (
                  <p className="text-red-500 text-sm mt-1">{errors.interest.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-[family-name:var(--font-poppins)] font-semibold mb-2"
                  style={{ color: "var(--heading)" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register("message")}
                  placeholder="Tell me about your goals and how I can help..."
                  className={`form-field w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all resize-none ${
                    errors.message ? "border-red-500" : ""
                  }`}
                  style={{
                    borderColor: errors.message ? undefined : "var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="w-full text-white px-8 py-4 rounded-lg font-[family-name:var(--font-poppins)] font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {submitStatus === "loading" ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="reveal-text">
            <div className="space-y-8">
              <div>
                <h3
                  className="font-[family-name:var(--font-poppins)] font-bold text-2xl mb-4"
                  style={{ color: "var(--heading)" }}
                >
                  Get in Touch
                </h3>
                <p className="leading-relaxed" style={{ color: "var(--foreground)" }}>
                  I&apos;m here to help you navigate your transformation journey.
                  Whether you&apos;re looking to implement AI solutions, transition
                  to remote work, or access growth resources, let&apos;s discuss how
                  we can work together.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Email",
                    value: "hello@saithavy.com",
                    bg: "var(--accent)",
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                  },
                  {
                    label: "Response Time",
                    value: "Within 24 hours",
                    bg: "var(--highlight)",
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                  },
                  {
                    label: "Location",
                    value: "Global (Remote)",
                    bg: "var(--heading)",
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                      style={{ backgroundColor: item.bg }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-poppins)] font-semibold" style={{ color: "var(--heading)" }}>
                        {item.label}
                      </p>
                      <p style={{ color: "var(--foreground)" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <h4
                  className="font-[family-name:var(--font-poppins)] font-semibold mb-4"
                  style={{ color: "var(--heading)" }}
                >
                  Follow the Journey
                </h4>
                <div className="flex space-x-4">
                  {["Twitter", "LinkedIn", "Pinterest"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:opacity-80"
                      style={{ backgroundColor: "var(--accent)" }}
                      aria-label={social}
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        {social === "Twitter" && (
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        )}
                        {social === "LinkedIn" && (
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        )}
                        {social === "Pinterest" && (
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                        )}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
