import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
  
const host = window.location.hostname; 
const parts = host.split('.');
const subdomain = parts.length > 1 && parts[0] !== 'localhost' ? parts[0] : null;

if (subdomain) {
  localStorage.setItem('currentSubdomain', subdomain);
}