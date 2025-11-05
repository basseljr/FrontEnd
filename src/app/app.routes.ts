import { Routes } from '@angular/router';
import { TemplatesListComponent } from './templates/templates-list/templates-list.component';
import { TemplatePreviewComponent } from './templates/template-preview/template-preview.component';
import { TemplateSelectedComponent } from './templates/template-selected/template-selected.component';

export const routes: Routes = [
  { path: '', redirectTo: 'templates', pathMatch: 'full' },
  { path: 'templates', component: TemplatesListComponent },
  { path: 'templates/:id', component: TemplatePreviewComponent },
  { path: 'selected', component: TemplateSelectedComponent }

];