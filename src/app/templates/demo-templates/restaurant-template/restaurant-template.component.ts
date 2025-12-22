import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ActivatedRoute, Router, NavigationEnd, RouterOutlet } from "@angular/router";
import { EditPanelComponent } from "../../components/edit-panel/edit-panel.component";
import { HeroSectionComponent } from "../../components/hero-section/hero-section.component";
import { CategorySectionComponent } from "../../components/category-section/category-section.component";
import { CategoryComponent } from "./pages/category/category.component";
import { HomeComponent } from "./pages/home/home.component";
import { TemplatesService } from '../../../core/services/templates.service';
import { CustomizationService } from '../../../core/services/customization.service';
import { TemplateLoaderService } from '../../../core/services/template-loader.service';
import { TemplateContextService } from '../../../core/services/template-context.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-restaurant-template',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet, EditPanelComponent, HeroSectionComponent, CategorySectionComponent,    HomeComponent],
  templateUrl: './restaurant-template.component.html',
  styleUrls: ['./restaurant-template.component.css']
})


export class RestaurantTemplateComponent implements OnInit, OnDestroy {
  private queryParamsSubscription?: Subscription;
  private parentQueryParamsSubscription?: Subscription;
  private navigationSubscription?: Subscription;

  constructor(
    private loader: TemplateLoaderService,
    public templateContext: TemplateContextService,
    public customization: CustomizationService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Automatically detect if it's demo or real domain
    this.loader.loadTemplateData();
    
    // Check query params for editMode=true (immediate check from snapshot)
    this.checkEditMode();
    
    // Subscribe to query params changes (check both current and parent routes)
    this.queryParamsSubscription = this.route.queryParams.subscribe(() => {
      this.checkEditMode();
    });
    // Also subscribe to parent route query params if available
    if (this.route.parent) {
      this.parentQueryParamsSubscription = this.route.parent.queryParams.subscribe(() => {
        this.checkEditMode();
      });
    }

    // Preserve editMode query param on all route changes (only for published sites)
    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (this.templateContext.isPublishedSite() && 
            this.customization.isEditMode && 
            this.authService.isTenantOwner()) {
          const url = event.urlAfterRedirects || event.url;
          // Only preserve if editMode=true is missing from URL
          if (!url.includes('editMode=true')) {
            const queryParams = this.templateContext.getPreservedQueryParams();
            if (Object.keys(queryParams).length > 0) {
              // Use current URL tree to preserve existing query params
              const urlTree = this.router.parseUrl(url);
              urlTree.queryParams['editMode'] = 'true';
              this.router.navigateByUrl(urlTree, { replaceUrl: true });
            }
          }
        }
      });
  }

  ngOnDestroy() {
    this.queryParamsSubscription?.unsubscribe();
    this.parentQueryParamsSubscription?.unsubscribe();
    this.navigationSubscription?.unsubscribe();
  }

  private checkEditMode(): void {
    // Check if editMode=true query param exists AND user is tenant owner
    // Check both current route and parent route for query params (handles lazy-loaded routes)
    let editModeParam = this.route.snapshot.queryParamMap.get('editMode');
    if (!editModeParam && this.route.parent) {
      editModeParam = this.route.parent.snapshot.queryParamMap.get('editMode');
    }
    const isEditModeEnabled = editModeParam === 'true';
    
    if (isEditModeEnabled && this.authService.isTenantOwner()) {
      this.customization.isEditMode = true;
      // Open panel automatically when entering edit mode
      this.customization.openPanel();
    } else if (!isEditModeEnabled) {
      // Disable edit mode if query param is not present or not 'true'
      this.customization.isEditMode = false;
      this.customization.closePanel();
    }
  }

  onSaveCustomization() {
    // When admin clicks save in edit mode
    this.loader.saveCustomization().subscribe({
      next: () => alert('Customization saved successfully!'),
      error: err => console.error('Save failed', err)
    });
  }
}