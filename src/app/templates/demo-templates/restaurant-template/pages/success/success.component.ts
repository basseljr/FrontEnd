import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EditableDirective } from '../../../../../core/directives/editable.directive';
import { CustomizationService } from '../../../../../core/services/customization.service';
import { OrderService } from '../../../../../core/services/order.service';
import { TemplateContextService } from '../../../../../core/services/template-context.service';
@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, EditableDirective],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit, OnDestroy {
  customData: any = {};
  order: any;
  subscription?: Subscription;

  constructor(
    private customization: CustomizationService,
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private templateContext: TemplateContextService
  ) {}

  ngOnInit() {
    // Load editable texts
    this.subscription = this.customization.currentData.subscribe(data => {
      this.customData = data.success || {};
    });

    // ✅ Fetch real order by ID
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe({
        next: (res) => (this.order = res),
        error: (err) => console.error('Failed to load order', err)
      });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  backToHome() {
    const routePrefix = this.templateContext.isPublishedSite() ? '/site' : '/demo';
    const url = this.router.url;
    // Extract slug from current route
    const match = url.match(/\/(?:site|demo)\/([^\/]+)/);
    const slug = match ? match[1] : 'restaurant-menu';
    const queryParams = this.templateContext.getPreservedQueryParams();
    this.router.navigate([routePrefix, slug], {
      queryParams: queryParams
    });
  }
}
