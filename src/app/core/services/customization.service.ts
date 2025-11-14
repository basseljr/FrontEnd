// // src/app/core/services/customization.service.ts
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class CustomizationService {
//   private data = new BehaviorSubject<any>({
//     header: {
//       name: 'Freej Swaeleh',
//       backgroundColor: '#b30000',
//       textColor: '#ffffff',
//       bottomNavBackground: '#ffffff'

//     }, 
//     hero: {
//     title: 'Freej Swaeleh',
//     logo: 'assets/images/aiw.png', // ✅ correct relative path
//     backgroundImage: 'assets/images/img1.jpg', // ✅ correct relative path
//     textColor: '#b30000'
//   },categories: {
//       textColor: '#b30000',
//       items: [
//         { id: '1', name: 'Main Course', image: 'assets/images/aiw.png' },
//         { id: '2', name: 'Soups', image: 'assets/images/aiw.png' },
//         { id: '3', name: 'Salad', image: 'assets/images/aiw.png' },
//         { id: '4', name: 'Starters', image: 'assets/images/aiw.png' },
//         { id: '5', name: 'Grilled', image: 'assets/images/aiw.png' },
//         { id: '6', name: 'Sweet Corner', image: 'assets/images/aiw.png' }
//       ]
//     },
//     footer: {
//     logo: 'assets/images/aiw.png',
//     backgroundColor: '#000000',
//     textColor: '#ffffff',
//     links: [
//       { key: 'menu', label: 'MENU' },
//       { key: 'orderStatus', label: 'ORDER STATUS' },
//       { key: 'aboutUs', label: 'ABOUT US' },
//       { key: 'privacyPolicy', label: 'PRIVACY POLICY' },
//       { key: 'branches', label: 'BRANCHES' }
//     ]
//   }

//   });

  
// selectedElement = new BehaviorSubject<any>(null);
// public isEditMode = false;

// selectElement(info: any) {
//   this.selectedElement.next(info);
// }
//   currentData = this.data.asObservable();

// update(section: string, key: string, value: any) {
//   const current = this.data.value;
//   const newData = { ...current };

//   // Handle categories (array of objects)
//   if (section === 'categories') {
//     // If key is like '1-name' or '2-image'
//     const [id, field] = key.split('-');

//     if (newData.categories?.items && id && field) {
//       const item = newData.categories.items.find((i: any) => i.id === id);
//       if (item) {
//         item[field] = value;
//       }
//     } else {
//       // fallback for simple property like textColor
//       newData.categories[key] = value;
//     }
//   } 
//   // Handle all other simple sections (header, hero, etc.)
//   else if (newData[section]) {
//     newData[section][key] = value;
//   } else {
//     console.warn(`Section "${section}" not found in customization data.`);
//   }

//   this.data.next(newData);
// }


// toggleEditMode() {
//   this.isEditMode = !this.isEditMode;
// }

// loadData(customizationData: any) {
//   if (!customizationData) return;
//   try {
//     const parsed = typeof customizationData === 'string'
//       ? JSON.parse(customizationData)
//       : customizationData;

//     this.data.next(parsed);
//   } catch (err) {
//     console.error('Failed to parse customization data', err);
//   }
// }

// }


// src/app/core/services/customization.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomizationService {
  private data = new BehaviorSubject<any>({
    header: {
      name: 'Freej Swaeleh',
      backgroundColor: '#b30000',
      textColor: '#ffffff',
      bottomNavBackground: '#ffffff'
    },
    hero: {
      title: 'Freej Swaeleh',
      logo: 'assets/images/aiw.png',
      backgroundImage: 'assets/images/img1.jpg',
      textColor: '#b30000'
    },
    categories: {
      textColor: '#b30000',
      items: [
        { id: '1', name: 'Main Course', image: 'assets/images/aiw.png' },
        { id: '2', name: 'Soups', image: 'assets/images/aiw.png' },
        { id: '3', name: 'Salad', image: 'assets/images/aiw.png' },
        { id: '4', name: 'Starters', image: 'assets/images/aiw.png' },
        { id: '5', name: 'Grilled', image: 'assets/images/aiw.png' },
        { id: '6', name: 'Sweet Corner', image: 'assets/images/aiw.png' }
      ]
    },
    footer: {
      logo: 'assets/images/aiw.png',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      links: [
        { key: 'menu', label: 'MENU' },
        { key: 'orderStatus', label: 'ORDER STATUS' },
        { key: 'aboutUs', label: 'ABOUT US' },
        { key: 'privacyPolicy', label: 'PRIVACY POLICY' },
        { key: 'branches', label: 'BRANCHES' }
      ]
    }
  });

  selectedElement = new BehaviorSubject<any>(null);
  public isEditMode = false;
selectElement(info: any) {
  this.selectedElement.next(info);
}

  // ✅ NEW: Track which template the user is editing
public currentTemplateSlug?: string;
public currentTemplateId?: number;


  // ✅ NEW: Observable for all customization data
  currentData = this.data.asObservable();

  /** Get the current customization snapshot (used for saving to backend) */
  getCurrentData() {
    return this.data.value;
  }

  /** Update any field dynamically */
  update(section: string, key: string, value: any) {
    const current = this.data.value;
    const newData = { ...current };

    if (section === 'categories') {
      const [id, field] = key.split('-');
      if (newData.categories?.items && id && field) {
        const item = newData.categories.items.find((i: any) => i.id === id);
        if (item) item[field] = value;
      } else {
        newData.categories[key] = value;
      }
    } else if (newData[section]) {
      newData[section][key] = value;
    } else {
      console.warn(`Section "${section}" not found in customization data.`);
    }

    this.data.next(newData);
  }

  /** Toggle edit mode */
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  /** Load customization JSON from backend */
  loadData(customizationData: any) {
    if (!customizationData) return;
    try {
      const parsed = typeof customizationData === 'string'
        ? JSON.parse(customizationData)
        : customizationData;
      this.data.next(parsed);
    } catch (err) {
      console.error('Failed to parse customization data', err);
    }
  }
}
