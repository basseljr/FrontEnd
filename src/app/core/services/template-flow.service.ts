// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { switchMap, catchError, map, tap } from 'rxjs/operators';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class TemplateFlowService {

//   private draftApi = `${environment.apiUrl}/TemplateDraft`;
//   private flowApi = `${environment.apiUrl}/TemplateFlow`;

//   constructor(private http: HttpClient) {}

//   // ----------------------------------------
//   // ✔ 1. GET USER'S EXISTING DRAFT (if any)
//   // ----------------------------------------
//   getUserDraft(): Observable<any> {
//     return this.http.get(`${this.draftApi}/user`);
//   }

//   // ----------------------------------------
//   // ✔ 2. CREATE NEW DRAFT
//   // ----------------------------------------
//   createDraft(templateId: number, customization: any): Observable<any> {
//     const body = {
//       templateId,
//       customizationData: JSON.stringify(customization)
//     };
//     return this.http.post(`${this.draftApi}`, body);
//   }

//   // ----------------------------------------
//   // ✔ 3. UPDATE EXISTING DRAFT
//   // ----------------------------------------
//   updateDraft(draftId: string, templateId: number, customization: any): Observable<any> {
//     const body = {
//       templateId,
//       customizationData: JSON.stringify(customization)
//     };
//     return this.http.put(`${this.draftApi}/${draftId}`, body);
//   }

//   // -------------------------------------------------------------
//   // ✔ 4. CREATE OR UPDATE (single draft per preview user)
//   // -------------------------------------------------------------
//   createOrUpdateDraft(templateId: number, customization: any): Observable<any> {
//     return this.getUserDraft().pipe(
//       switchMap((existing: any) => {
//         if (existing && existing.id) {
//           // Draft exists → UPDATE
//           return this.updateDraft(existing.id, templateId, customization).pipe(
//             map(res => ({ ...res, draftId: existing.id })) // ensure draftId always returned
//           );
//         } else {
//           // No draft exists → CREATE
//           return this.createDraft(templateId, customization).pipe(
//             map((res: any) => ({ ...res, draftId: res.id }))
//           );
//         }
//       }),
//       catchError(err => {
//         // If GET /user returns 404 → no draft → create one
//         if (err.status === 404) {
//           return this.createDraft(templateId, customization).pipe(
//             map((res: any) => ({ ...res, draftId: res.id }))
//           );
//         }
//         throw err;
//       })
//     );
//   }

//   // ----------------------------------------
//   // ✔ 5. GET DRAFT BY ID
//   // ----------------------------------------
//   getDraft(draftId: string): Observable<any> {
//     return this.http.get(`${this.draftApi}/${draftId}`);
//   }

//   // ----------------------------------------
//   // ✔ 6. CREATE TENANT FROM DRAFT
//   // ----------------------------------------
//   createTenantFromDraft(draftId: string, email: string, password: string, plan: string): Observable<any> {
//     return this.http
//       .post(`${this.flowApi}/create-tenant-from-draft`, {
//         draftId,
//         email,
//         password,
//         plan
//       })
//       .pipe(
//         tap((response: any) => {
//           if (response?.subdomain) {
//             localStorage.setItem("tenantSubdomain", response.subdomain);
//           }
//         })
//       );
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateFlowService {

  private apiUrl = `${environment.apiUrl}/TemplateDraft`;

  constructor(private http: HttpClient) {}

  /** Get draft by user email */
  getUserDraft(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${email}`).pipe(
      catchError(() => of(null))
    );
  }

  /** Create new or update existing draft */
  updateOrCreateDraft(templateId: number, customization: any): Observable<any> {
    const email = localStorage.getItem("userEmail");
    console.log("email", email);
    const body = {
      email,
      templateId,
      customizationData: JSON.stringify(customization)
    };

    return this.http.post(`${this.apiUrl}/update-or-create`, body);
  }

  /** Publish (create tenant from draft) */
  createTenantFromDraft(draftId: string, email: string, password: string, plan: string): Observable<any> {
    if (Array.isArray(email)) {
      email = email[0];
    }
    
    if (email.includes(",")) {
      email = email.split(",")[0].trim();
    }
    return this.http.post(`${environment.apiUrl}/TemplateFlow/create-tenant-from-draft`, {
      draftId,
      email,
      password,
      plan
    });
  }

}
