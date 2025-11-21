
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../../../core/services/settings.service';
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

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.loadSettings();
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

