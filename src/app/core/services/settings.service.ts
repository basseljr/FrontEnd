import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { RestaurantSettings } from '../models/settings.model';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/Settings`;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getSettings(): Observable<RestaurantSettings> {
    if (this.authService.isPreviewMode()) {
      return of({
        restaurantName: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        currency: 'KWD',
        taxRate: 0,
        deliveryFee: 0,
        businessHours: [],
        paymentOptions: []
      });
    }
    return this.http.get<RestaurantSettings>(this.apiUrl);
  }

  updateSettings(settings: RestaurantSettings): Observable<RestaurantSettings> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.put<RestaurantSettings>(`${this.apiUrl}/update`, settings);
  }
}

