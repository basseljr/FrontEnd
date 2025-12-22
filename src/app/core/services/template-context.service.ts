import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export type TemplateMode = 'preview' | 'published' | 'demo' | 'platform';

@Injectable({ providedIn: 'root' })
export class TemplateContextService {
  private modeSubject = new BehaviorSubject<TemplateMode>('platform');
  public mode$: Observable<TemplateMode> = this.modeSubject.asObservable();
  
  private editModeSubject = new BehaviorSubject<boolean>(false);
  public editMode$: Observable<boolean> = this.editModeSubject.asObservable();

  constructor(private router: Router) {
    // Update mode on route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateMode();
        this.updateEditMode();
      });
    
    // Initial mode detection
    this.updateMode();
    this.updateEditMode();
  }

  /**
   * Check if in template preview mode
   * True ONLY for /template-preview and /template-selected
   */
  isTemplatePreview(): boolean {
    const url = this.router.url;
    return url.includes('/template-preview') || url.includes('/template-selected');
  }

  /**
   * Check if in published site
   * True ONLY for /site/:slug
   */
  isPublishedSite(): boolean {
    const url = this.router.url;
    return url.startsWith('/site/') && !url.includes('/template-');
  }

  /**
   * Check if in demo mode
   * True ONLY for /demo/:slug
   */
  isDemo(): boolean {
    const url = this.router.url;
    return url.startsWith('/demo/');
  }

  /**
   * Get current mode
   */
  getCurrentMode(): TemplateMode {
    return this.modeSubject.value;
  }

  /**
   * Update mode based on current route
   */
  private updateMode(): void {
    if (this.isTemplatePreview()) {
      this.modeSubject.next('preview');
    } else if (this.isPublishedSite()) {
      this.modeSubject.next('published');
    } else if (this.isDemo()) {
      this.modeSubject.next('demo');
    } else {
      this.modeSubject.next('platform');
    }
  }

  /**
   * Update edit mode state from query params
   */
  private updateEditMode(): void {
    const url = this.router.url;
    // Check for editMode=true in query params
    const match = url.match(/[?&]editMode=([^&]+)/);
    const isEditMode = match ? match[1] === 'true' : false;
    this.editModeSubject.next(isEditMode);
  }

  /**
   * Get current template ID from route query params, fallback to localStorage
   */
  getCurrentTemplateId(): number | null {
    // Try reading from route query params first
    const url = this.router.url;
    if (url.includes('/template-selected') || url.includes('/template-preview')) {
      const match = url.match(/[?&]id=(\d+)/);
      if (match) {
        return Number(match[1]);
      }
    }
    
    // Fallback to localStorage
    const savedId = localStorage.getItem("selectedTemplateId");
    if (savedId) {
      return Number(savedId);
    }
    
    return null;
  }


  getPublishedTenantId(): number | null {
    const url = this.router.url;
    const match = url.match(/^\/site\/([^\/]+)/);
    if (!match) return null;
  
    const slug = match[1];
    return Number(localStorage.getItem(`tenantId_for_${slug}`));
  }
  

  /**
   * Get current template slug from route query params, fallback to localStorage
   */
  getCurrentTemplateSlug(): string | null {
    // Try reading from route query params first
    const url = this.router.url;
    if (url.includes('/template-selected') || url.includes('/template-preview')) {
      const match = url.match(/[?&]slug=([^&]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    }
    
    // Fallback to localStorage
    const savedSlug = localStorage.getItem("selectedTemplateSlug");
    if (savedSlug) {
      return savedSlug;
    }
    
    return null;
  }

  /**
   * Check if edit mode is enabled via query parameter
   * Returns true only if editMode=true exists in query params
   */
  isEditMode(): boolean {
    return this.editModeSubject.value;
  }

  /**
   * Get query params to preserve editMode during navigation
   * Returns { editMode: true } if editMode is currently enabled, otherwise {}
   */
  getPreservedQueryParams(): { editMode?: string } {
    return this.isEditMode() ? { editMode: 'true' } : {};
  }
}

