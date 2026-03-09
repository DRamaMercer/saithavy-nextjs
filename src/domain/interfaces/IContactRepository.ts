import { Contact } from "../entities/Contact";

export interface IContactRepository {
  save(contact: Contact): Promise<void>;
}
