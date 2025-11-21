import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestaurantSettings } from '../models/settings.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/Settings`;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<RestaurantSettings> {
    return this.http.get<RestaurantSettings>(this.apiUrl);
  }

  updateSettings(settings: RestaurantSettings): Observable<RestaurantSettings> {
    return this.http.put<RestaurantSettings>(`${this.apiUrl}/update`, settings);
  }
}

