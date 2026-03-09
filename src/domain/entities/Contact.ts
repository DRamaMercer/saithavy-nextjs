export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  interest: "ai-consulting" | "remote-work" | "content-resources" | "speaking" | "other";
  message: string;
  timestamp: Date;
}
