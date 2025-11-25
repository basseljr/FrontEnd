import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CustomerData {
  email: string;
  password: string; // In real app, this would be hashed
  name: string;
  mobile: string;
  country: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerAuthService {
  private customerKey = 'customer_data';
  private currentCustomerSubject = new BehaviorSubject<CustomerData | null>(null);
  public currentCustomer$ = this.currentCustomerSubject.asObservable();

  constructor() {
    // Load customer from localStorage on init
    const customer = this.getCurrentCustomer();
    if (customer) {
      this.currentCustomerSubject.next(customer);
    }
  }

  /**
   * Register a new customer (store in localStorage)
   */
  register(customerData: CustomerData): Observable<boolean> {
    return new Observable(observer => {
      try {
        // Store customer data in localStorage
        localStorage.setItem(this.customerKey, JSON.stringify(customerData));
        this.currentCustomerSubject.next(customerData);
        observer.next(true);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Login customer (verify from localStorage)
   */
  login(email: string, password: string): Observable<CustomerData | null> {
    return new Observable(observer => {
      try {
        const stored = localStorage.getItem(this.customerKey);
        if (!stored) {
          observer.next(null);
          observer.complete();
          return;
        }

        const customer: CustomerData = JSON.parse(stored);
        
        // Verify email and password match
        if (customer.email === email && customer.password === password) {
          this.currentCustomerSubject.next(customer);
          observer.next(customer);
        } else {
          observer.next(null);
        }
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Logout customer
   */
  logout(): void {
    localStorage.removeItem(this.customerKey);
    this.currentCustomerSubject.next(null);
  }

  /**
   * Check if customer is logged in
   */
  isCustomerLoggedIn(): boolean {
    return this.getCurrentCustomer() !== null;
  }

  /**
   * Get current customer data
   */
  getCurrentCustomer(): CustomerData | null {
    try {
      const stored = localStorage.getItem(this.customerKey);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
}


