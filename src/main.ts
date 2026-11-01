import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((error: unknown) => {
  document.documentElement.classList.add('initial-loader-failed');
  console.error('Scuba Lak failed to start.', error);
});
