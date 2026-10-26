import { ENQUIRY_COPY } from '../../data/enquiry-copy';
import { ContactRequest } from '../../models/site-data.model';

export function validateEnquiry(form: ContactRequest): Partial<Record<keyof ContactRequest, string>> {
  const errors: Partial<Record<keyof ContactRequest, string>> = {};
  if (form.name.trim().length < 2 || form.name.length > 100) errors.name = ENQUIRY_COPY.nameError;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.length > 254) errors.email = ENQUIRY_COPY.emailError;
  if (form.message.trim().length < 12 || form.message.length > 2000) errors.message = ENQUIRY_COPY.messageError;
  return errors;
}
