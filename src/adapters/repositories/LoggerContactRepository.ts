import { IContactRepository } from "../../domain/interfaces/IContactRepository";
import { Contact } from "../../domain/entities/Contact";
import { logger } from "@/lib/logger";

export class LoggerContactRepository implements IContactRepository {
  async save(contact: Contact): Promise<void> {
    // Following YAGNI, we just log it for now until a real database is needed.
    logger.info("Contact form submission saved (Logger Adapter)", {
      name: `${contact.firstName} ${contact.lastName}`,
      email: contact.email,
      interest: contact.interest,
      message: contact.message,
      timestamp: contact.timestamp.toISOString(),
    });
  }
}
