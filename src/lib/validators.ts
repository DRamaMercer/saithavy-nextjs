import { z } from "zod";



export const contactSchema = z.object({
  firstName: z
    .string({ error: "First name must be a string" })
    .min(1, { error: "First name is required" })
    .max(50, { error: "First name must be 50 characters or less" }),
  lastName: z
    .string({ error: "Last name must be a string" })
    .min(1, { error: "Last name is required" })
    .max(50, { error: "Last name must be 50 characters or less" }),
  email: z.email({ error: "Please enter a valid email address" }),
  interest: z.enum([
    "ai-consulting",
    "remote-work",
    "content-resources",
    "speaking",
    "other",
  ]),
  message: z
    .string({ error: "Message must be a string" })
    .min(10, { error: "Message must be at least 10 characters" })
    .max(1000, { error: "Message must be 1000 characters or less" }),
  honeypot: z.string().max(0, { error: "Spam detected" }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

