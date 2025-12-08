
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../../../../core/services/settings.service';
import { AuthenticationService } from '../../../../../core/services/authentication.service';
import { RestaurantSettings, BusinessHours, PaymentOption } from '../../../../../core/models/settings.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings: RestaurantSettings = {
    restaurantName: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    currency: 'KWD',
    taxRate: 0,
    deliveryFee: 0,
    businessHours: this.getDefaultBusinessHours(),
    paymentOptions: [
      { type: 'Cash', enabled: true },
      { type: 'KNET', enabled: true },
      { type: 'Visa', enabled: true }
    ]
  };

  loading = true;
  saving = false;
  error = '';
  success = '';
  isPreviewMode = false;

  constructor(
    private settingsService: SettingsService,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check preview mode FIRST - before any API calls
    this.isPreviewMode = this.authService.isPreviewMode() || (this.route.snapshot.queryParamMap.get('preview') === 'true');

    if (this.isPreviewMode) {
      this.loadDummyData();
      return; // Exit early - no API calls
    }

    this.loadSettings();
  }

  loadDummyData() {
    this.loading = true;
    setTimeout(() => {
      this.settings = {
        restaurantName: 'Sample Restaurant',
        description: 'A sample restaurant for preview',
        address: '123 Main Street, Kuwait City',
        phone: '+965 12345678',
        email: 'info@samplerestaurant.com',
        currency: 'KWD',
        taxRate: 5,
        deliveryFee: 2.5,
        businessHours: this.getDefaultBusinessHours(),
        paymentOptions: [
          { type: 'Cash', enabled: true },
          { type: 'KNET', enabled: true },
          { type: 'Visa', enabled: true }
        ]
      };
      this.loading = false;
    }, 500);
  }

  getDefaultBusinessHours(): BusinessHours[] {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => ({
      day,
      openTime: '09:00',
      closeTime: '22:00',
      isClosed: false
    }));
  }

  loadSettings() {
    if (this.isPreviewMode) {
      return; // Don't call APIs in preview mode
    }
    this.loading = true;
    this.settingsService.getSettings().subscribe({
      next: (data) => {
        this.settings = {
          ...this.settings,
          ...data,
          businessHours: data.businessHours || this.getDefaultBusinessHours(),
          paymentOptions: data.paymentOptions || this.settings.paymentOptions
        };
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load settings';
        this.loading = false;
      }
    });
  }

  saveSettings() {
    if (this.isPreviewMode) {
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
    this.saving = true;
    this.error = '';
    this.success = '';
    
    this.settingsService.updateSettings(this.settings).subscribe({
      next: () => {
        this.success = 'Settings saved successfully';
        this.saving = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: () => {
        this.error = 'Failed to save settings';
        this.saving = false;
      }
    });
  }


  togglePaymentOption(type: 'Cash' | 'KNET' | 'Visa') {
    const option = this.settings.paymentOptions.find(p => p.type === type);
    if (option) {
      option.enabled = !option.enabled;
    }
  }

  isPaymentEnabled(type: 'Cash' | 'KNET' | 'Visa'): boolean {
    return this.settings.paymentOptions.find(p => p.type === type)?.enabled ?? false;
  }
}

