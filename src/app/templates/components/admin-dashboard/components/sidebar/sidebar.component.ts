import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../../../core/services/authentication.service';
import { TemplateContextService } from '../../../../../core/services/template-context.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isCollapsed = true; // Start collapsed on mobile
  activeRoute = '';
  private authSubscription?: Subscription;

  menuItems = [
    { path: 'overview', label: 'Overview', icon: 'bi-speedometer2' },  
    { path: 'orders', label: 'Orders', icon: 'bi-cart-check' },
    { path: 'menu', label: 'Menu', icon: 'bi-menu-button-wide' },
    { path: 'categories', label: 'Categories', icon: 'bi-folder' },
    { path: 'inventory', label: 'Inventory', icon: 'bi-boxes' },
    { path: 'customers', label: 'Customers', icon: 'bi-people' },
    { path: 'analytics', label: 'Analytics', icon: 'bi-graph-up' },
    { path: 'settings', label: 'Settings', icon: 'bi-gear' },
    { path: 'customize', label: 'Customize Website', icon: 'bi-paint-bucket' }
  ];
  
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private templateContext: TemplateContextService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
      });
    this.activeRoute = this.router.url;

    // Subscribe to auth state changes to trigger change detection
    this.authSubscription = this.authService.currentUser$.subscribe(() => {
      // This will trigger change detection when user state changes
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  isActive(path: string): boolean {
    const fullPath = '/admin/dashboard/' + path;
  
    return (
      this.activeRoute === fullPath ||
      this.activeRoute.startsWith(fullPath)
    );
  }

  getVisitButtonText(): string | null {
    const user = this.authService.getCurrentUser();
    if (!user) return null;

    const tenantId = Number(user.tenantId);
    if (tenantId === 5) return "Back to Preview Website";
    if (tenantId > 5) return "Visit Website";
    return null;
  }

  visitSite() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const tenantId = Number(user.tenantId);

    // Preview user → go back to template-selected
    if (tenantId === 5) {
      let id = this.templateContext.getCurrentTemplateId();
      let slug = this.templateContext.getCurrentTemplateSlug();
      
      // If missing, try reading from localStorage directly
      if (!id) {
        const savedId = localStorage.getItem("selectedTemplateId");
        if (savedId) {
          id = Number(savedId);
        }
      }
      
      if (!slug) {
        const savedSlug = localStorage.getItem("selectedTemplateSlug");
        if (savedSlug) {
          slug = savedSlug;
        }
      }
      
      if (id && slug) {
        this.router.navigate(['/template-selected'], { queryParams: { id, slug } });
      }
      return;
    }

    // Real tenant → visit live website
    if (tenantId > 5) {
      const sub = this.authService.getSubdomain();
      if (sub) {
        this.router.navigate([`/site/${sub}`]);
      }
      return;
    }
  }
}

