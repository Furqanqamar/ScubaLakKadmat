import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { ENQUIRY_DELIVERY, EnquiryDeliveryConfig } from '../../data/business-config';
import { ContactRequest } from '../../models/site-data.model';

export const ENQUIRY_DELIVERY_CONFIG = new InjectionToken<EnquiryDeliveryConfig>('Enquiry delivery configuration', { providedIn: 'root', factory: () => ENQUIRY_DELIVERY });

export interface EnquirySubmissionMetadata {
  readonly website: string;
  readonly startedAt: number;
}

@Injectable({ providedIn: 'root' })
export class EnquiryDeliveryService {
  private readonly http = inject(HttpClient);
  private readonly configuration = inject(ENQUIRY_DELIVERY_CONFIG);
  async submit(request: ContactRequest, metadata: EnquirySubmissionMetadata): Promise<void> {
    const configuration = this.configuration;
    if (configuration.mode !== 'endpoint' || new URL(configuration.url).protocol !== 'https:') throw new Error('Submission is unavailable');
    const payload = {
      ...request, name: request.name.trim(), email: request.email.trim(), phone: request.phone.trim(), message: request.message.trim(),
      website: metadata.website, formAgeMs: Math.max(0, Date.now() - metadata.startedAt)
    };
    const result = await firstValueFrom(this.http.post<unknown>(configuration.url, payload).pipe(timeout(20000)));
    if (!result || typeof result !== 'object' || !('accepted' in result) || result.accepted !== true) throw new Error('No acceptance acknowledgement');
  }
}
