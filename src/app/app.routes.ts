import { Routes } from '@angular/router';
import { LandingPageComponent } from './modules/landing/landing-page/landing-page.component';
import { TemplatesListComponent } from './templates/templates-list/templates-list.component';
import { TemplatePreviewComponent } from './templates/template-preview/template-preview.component';
import { TemplateSelectedComponent } from './templates/template-selected/template-selected.component';

export const routes: Routes = [
  { path: '', redirectTo: 'templates', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent },
  { path: 'templates', component: TemplatesListComponent },
  { path: 'templates/:id', component: TemplatePreviewComponent },
  { path: 'selected', component: TemplateSelectedComponent },
  // ✅ dynamic template name for demo
  {
    path: 'demo/:templateName',
    loadChildren: () =>
      import('./templates/demo-templates/restaurant-template/restaurant-template-routing.module')
        .then(m => m.RestaurantTemplateRoutingModule)
  }


];