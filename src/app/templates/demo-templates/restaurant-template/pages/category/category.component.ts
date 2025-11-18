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

addToCart(item: any) {
  this.cartService.addItem({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: 1,
    imageUrl: item.imageUrl
  });

}
}
