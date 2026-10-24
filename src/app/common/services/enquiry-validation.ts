import { ENQUIRY_COPY } from '../../data/enquiry-copy';
import { ContactRequest } from '../../models/site-data.model';

export function validateEnquiry(form: ContactRequest, today = new Date()): Partial<Record<keyof ContactRequest, string>> {
  const errors: Partial<Record<keyof ContactRequest, string>> = {};
  if (form.name.trim().length < 2 || form.name.length > 100) errors.name = ENQUIRY_COPY.nameError;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.length > 254) errors.email = ENQUIRY_COPY.emailError;
  if (form.message.trim().length < 12 || form.message.length > 2000) errors.message = ENQUIRY_COPY.messageError;
  if (form.guests != null && (!Number.isInteger(form.guests) || form.guests < 1 || form.guests > 100)) errors.guests = ENQUIRY_COPY.guestsError;
  if (form.arrivalDate) {
    const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const date = new Date(form.arrivalDate + 'T12:00:00');
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(form.arrivalDate) && !Number.isNaN(date.getTime())
      && date.getFullYear() === Number(form.arrivalDate.slice(0, 4))
      && date.getMonth() + 1 === Number(form.arrivalDate.slice(5, 7))
      && date.getDate() === Number(form.arrivalDate.slice(8, 10));
    if (!valid || form.arrivalDate < localToday) errors.arrivalDate = ENQUIRY_COPY.dateError;
  }
  return errors;
}
