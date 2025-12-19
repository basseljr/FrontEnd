import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TemplateDraftService {

  private DRAFT_KEY = 'aiw_template_draft';
  private TEMPLATE_ID_KEY = 'aiw_template_id';

  /** Save draft to localStorage */
  saveDraft(templateId: number, customization: any) {
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(customization));
    localStorage.setItem(this.TEMPLATE_ID_KEY, templateId.toString());
  }

  /** Load draft */
  loadDraft() {
    const raw = localStorage.getItem(this.DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  /** Load which template the draft is for */
  getTemplateId() {
    return Number(localStorage.getItem(this.TEMPLATE_ID_KEY));
  }

  /** Clear draft after publish */
  clearDraft() {
    localStorage.removeItem(this.DRAFT_KEY);
    localStorage.removeItem(this.TEMPLATE_ID_KEY);
  }
}
