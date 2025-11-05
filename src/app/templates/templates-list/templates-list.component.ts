import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';  

import { TemplatesService, Template } from '../../core/services/templates.service';

@Component({
  selector: 'app-templates-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.css']
})
export class TemplatesListComponent implements OnInit {
  templates: Template[] = [];
  loading = true;
  errorMessage = '';

  constructor(private templatesService: TemplatesService) {}

  ngOnInit() {
    this.templatesService.getTemplates().subscribe({
      next: (data) => {
        this.templates = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load templates.';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
