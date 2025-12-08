import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  @ViewChild('sidebar') sidebar!: SidebarComponent;

  constructor(
    public authService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  get isPreviewMode(): boolean {
    // Check both authService and query parameter
    return this.authService.isPreviewMode() || (this.route.snapshot.queryParamMap.get('preview') === 'true');
  }

  toggleSidebar() {
    if (this.sidebar) {
      this.sidebar.toggleSidebar();
    }
  }
}

