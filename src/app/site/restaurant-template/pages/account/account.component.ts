import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../../core/services/authentication.service';

@Component({
  selector: 'app-end-user-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class EndUserAccountComponent implements OnInit {
  user: any = null;
  slug = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.user = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
  }

  goToOrderHistory() {
    this.router.navigate(['/site', this.slug, 'order-history']);
  }
}

