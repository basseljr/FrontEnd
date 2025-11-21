import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion } from '../models/promotion.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PromotionsService {
  private apiUrl = `${environment.apiUrl}/Promotions`;

  constructor(private http: HttpClient) {}

  getAllPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl);
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/${id}`);
  }

  createPromotion(promotion: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(this.apiUrl, promotion);
  }

  updatePromotion(id: number, promotion: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.apiUrl}/${id}`, promotion);
  }

  deletePromotion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  togglePromotionStatus(id: number, isActive: boolean): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.apiUrl}/${id}/status`, { isActive });
  }
}

