import { ENQUIRY_COPY } from '../../data/enquiry-copy';
import { ContactRequest } from '../../models/site-data.model';

// Match the deployed enquiry Worker's single-line/header and mailbox rules.
// Cross-layer fixture tests guard against either side drifting independently.
const singleLine = (value: string, max: number): boolean => value.length <= max && !/[\r\n\u0000-\u001f\u007f]/.test(value);
function validEmail(value: string): boolean {
  if (!singleLine(value, 254) || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(value)) return false;
  const [local, domain] = value.split('@');
  return local.length <= 64 && !local.startsWith('.') && !local.endsWith('.') && !local.includes('..') && domain.split('.').every(label => label.length <= 63);
}

export function validateEnquiry(form: ContactRequest): Partial<Record<keyof ContactRequest, string>> {
  const errors: Partial<Record<keyof ContactRequest, string>> = {};
  if (!singleLine(form.name, 100) || form.name.trim().length < 2) errors.name = ENQUIRY_COPY.nameError;
  if (!singleLine(form.email, 254) || !validEmail(form.email.trim())) errors.email = ENQUIRY_COPY.emailError;
  if (!singleLine(form.phone, 30)) errors.phone = ENQUIRY_COPY.phoneError;
  if (form.message.trim().length < 12 || form.message.length > 2000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(form.message)) errors.message = ENQUIRY_COPY.messageError;
  return errors;
}
