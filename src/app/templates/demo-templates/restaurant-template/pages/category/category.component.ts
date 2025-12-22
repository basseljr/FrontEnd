import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService, Item } from '../../../../../core/services/items.service';
import { CartService } from '../../../../../core/services/cart.service';
import { MenuService } from '../../../../../core/services/menu.service';
import { TemplateContextService } from '../../../../../core/services/template-context.service';
import { MenuItem } from '../../../../../core/models/menu-item.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  items: Item[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    protected router: Router,
    private cartService: CartService,
    private menuService: MenuService,
    private templateContext: TemplateContextService
  ) {}

  ngOnInit() {
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Detect if this is a live site (/site/:slug) or demo site (/demo/:slug)
    const isPublishedSite = this.templateContext.isPublishedSite();
    
    if (isPublishedSite) {
      // Live site: Use MenuService to get all items and filter by category
      this.menuService.getAllItems().subscribe({
        next: (menuItems: MenuItem[]) => {
          // Filter by categoryId and only show available items
          const filteredItems = menuItems
            .filter(item => item.categoryId === categoryId && item.isAvailable)
            .map(menuItem => this.convertMenuItemToItem(menuItem));
          
          this.items = filteredItems;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load menu items';
          this.loading = false;
        }
      });
    } else {
      // Demo mode: Continue using ItemsService (existing behavior)
      this.itemsService.getByCategory(categoryId).subscribe({
        next: (data) => {
          this.items = data;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load items';
          this.loading = false;
        }
      });
    }
  }

  viewItem(itemId: number) {
    const routePrefix = this.getRoutePrefix();
    const slug = this.getSlug();
    const queryParams = this.templateContext.getPreservedQueryParams();
    this.router.navigate([routePrefix, slug, 'item', itemId], {
      queryParams: queryParams
    });
  }

  /**
   * Get route prefix based on context (/site for published, /demo for demo)
   */
  private getRoutePrefix(): string {
    return this.templateContext.isPublishedSite() ? '/site' : '/demo';
  }

  /**
   * Get slug from current route
   */
  private getSlug(): string {
    const url = this.router.url;
    // Extract slug from /site/:slug or /demo/:slug
    const match = url.match(/\/(?:site|demo)\/([^\/]+)/);
    return match ? match[1] : 'restaurant-menu';
  }

  /**
   * Get home route for back button
   */
  getHomeRoute(): string[] {
    const routePrefix = this.getRoutePrefix();
    const slug = this.getSlug();
    return [routePrefix, slug];
  }

  /**
   * Navigate to home with preserved query params
   */
  navigateToHome(): void {
    const routePrefix = this.getRoutePrefix();
    const slug = this.getSlug();
    const queryParams = this.templateContext.getPreservedQueryParams();
    this.router.navigate([routePrefix, slug], {
      queryParams: queryParams
    });
  }

  canAddToCart(item: Item): boolean {
    // If isTrackStock is false, always allow adding to cart
    if (item.isTrackStock === false) {
      return true;
    }
    // If isTrackStock is true, check stockQuantity
    if (item.isTrackStock === true) {
      return (item.stockQuantity ?? 0) > 0;
    }
    // Default: allow (for backward compatibility)
    return true;
  }

  addToCart(item: Item) {
    // Validate stock before adding if tracking is enabled
    if (item.isTrackStock === true) {
      if (!item.stockQuantity || item.stockQuantity <= 0) {
        alert('This item is out of stock');
        return;
      }
    }

    this.cartService.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      finalPrice: item.finalPrice
    } as any);
  }

  /**
   * Convert MenuItem to Item interface for cart compatibility
   */
  private convertMenuItemToItem(menuItem: MenuItem): Item {
    // Calculate finalPrice if discount exists
    const discount = menuItem.discountPercentage;
    const finalPrice = discount && discount > 0
      ? menuItem.price - (menuItem.price * discount / 100)
      : menuItem.price;

    return {
      id: menuItem.id!,
      categoryId: menuItem.categoryId,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      imageUrl: menuItem.imageUrl,
      isAvailable: menuItem.isAvailable,
      stockQuantity: menuItem.stockQuantity,
      isTrackStock: menuItem.isTrackStock,
      discount: discount,
      finalPrice: finalPrice
    };
  }
}
