// src/app/pages/site-viewer/site-viewer.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TemplatesService } from '../../core/services/templates.service';
import { CustomizationService } from '../../core/services/customization.service';
import { RestaurantTemplateComponent } from '../../templates/demo-templates/restaurant-template/restaurant-template.component';

@Component({
  selector: 'app-site-viewer',
  standalone: true,
  imports: [CommonModule, RestaurantTemplateComponent, RouterOutlet],
  templateUrl: './site-viewer.component.html',
  styleUrls: ['./site-viewer.component.css']
})
export class SiteViewerComponent implements OnInit {
  loading = true;
  error = '';
  templateName = '';
  customizationData: any = null;

  constructor(
    private route: ActivatedRoute,
    private templatesService: TemplatesService,
    private customization: CustomizationService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) { this.error = 'Missing slug'; return; }

    this.templatesService.getTemplateBySlug(slug).subscribe({
      next: (res: any) => {
        this.templateName = res.templateName;
        this.customization.loadData(res.customizationData);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Site not found';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
