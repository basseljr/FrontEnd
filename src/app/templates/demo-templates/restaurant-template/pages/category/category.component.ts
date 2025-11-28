import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService, Item } from '../../../../../core/services/items.service';
import { CartService } from '../../../../../core/services/cart.service';

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
    private cartService: CartService
  ) {}

  ngOnInit() {
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));
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

  viewItem(itemId: number) {
    this.router.navigate(['/demo/restaurant/item', itemId]);
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
      imageUrl: item.imageUrl
    });
  }
}
