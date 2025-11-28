import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed = true; // Start collapsed on mobile
  activeRoute = '';

  menuItems = [
    { path: '/admin', label: 'Overview', icon: 'bi-speedometer2' },
    { path: '/admin/orders', label: 'Orders', icon: 'bi-cart-check' },
    { path: '/admin/menu', label: 'Menu', icon: 'bi-menu-button-wide' },
    { path: '/admin/categories', label: 'Categories', icon: 'bi-folder' },
    { path: '/admin/inventory', label: 'Inventory', icon: 'bi-boxes' },
    { path: '/admin/customers', label: 'Customers', icon: 'bi-people' },
    { path: '/admin/analytics', label: 'Analytics', icon: 'bi-graph-up' },
    { path: '/admin/settings', label: 'Settings', icon: 'bi-gear' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
      });
    this.activeRoute = this.router.url;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  isActive(path: string): boolean {
    if (path === '/admin') {
      return this.activeRoute === '/admin' || this.activeRoute === '/admin/';
    }
    return this.activeRoute.startsWith(path);
  }
}

