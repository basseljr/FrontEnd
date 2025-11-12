import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TemplatesService, Template } from '../../core/services/templates.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.css']
})
export class TemplatePreviewComponent implements OnInit {

  template?: Template;
  loading = true;
  errorMessage = '';

 constructor(
  private route: ActivatedRoute,
  private templatesService: TemplatesService,
  private router: Router
) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.templatesService.getTemplate(id).subscribe({
      next: (data) => {
        this.template = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Template not found.';
        this.loading = false;
      }
    });
  }

  useTemplate() {
  if (!this.template) return;

  // Save the selected template in localStorage
  localStorage.setItem('selectedTemplate', JSON.stringify(this.template));

  alert(`Template "${this.template.name}" has been selected!`);

      this.router.navigate(['/selected']);

}


getDemoLink(): string[] {
  if (!this.template?.name) return ['/demo', 'default'];
  const slug = this.template.name.toLowerCase().replace(/\s+/g, '-');
  return ['/demo', slug];
}

}
