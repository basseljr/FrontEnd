import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TemplatesService } from './core/services/templates.service';
import { CustomizationService } from './core/services/customization.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  constructor(
    private templates: TemplatesService,
    private customization: CustomizationService,
    private router: Router
  ) {}

  ngOnInit() {
    const host = window.location.hostname;  // e.g. restaurant.localhost
    const subdomain = host.split('.')[0];   // restaurant

    // Skip redirect for main builder (aiw.localhost or localhost)
    if (subdomain && subdomain !== 'localhost' && subdomain !== 'aiw') {
      localStorage.setItem('currentSubdomain', subdomain);

      // Redirect to the site's route
      this.router.navigate(['/site', subdomain]);

      // Fetch customization data dynamically
      this.templates.getTemplateByDomain(subdomain).subscribe({
        next: (data) => {
          this.customization.loadData(data.customizationData);
          console.log(`Customization loaded for subdomain: ${subdomain}`);
        },
        error: (err) => console.error('Failed to load customization', err)
      });
    }
  }
}
