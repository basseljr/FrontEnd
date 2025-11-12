// import {
//   Component,
//   AfterViewInit,
//   ViewEncapsulation
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TemplatesService, Template } from '../../../core/services/templates.service';


// // Optional: if you plan to use Chart.js via npm
// // import Chart from 'chart.js/auto';

// @Component({
//   selector: 'app-landing-page',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './landing-page.component.html',
//   styleUrls: ['./landing-page.component.css'],
//   encapsulation: ViewEncapsulation.None
// })
// export class LandingPageComponent implements AfterViewInit {
//   ngAfterViewInit(): void {
//     this.loadUnicornStudio();
//     this.initCharts();
//     this.initCarousel();
//     this.initMenuToggle();
//     this.initBillingToggle();
//     this.initIntersectionAnimations();
//     this.initSmoothScroll();
//     this.initKaraoke();
//     this.initTitleAnimations();
//   }

//   private loadUnicornStudio() {
//     if (!(window as any).UnicornStudio) {
//       const s = document.createElement('script');
//       s.src =
//         'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
//       s.onload = () => {
//         (window as any).UnicornStudio?.init?.();
//       };
//       document.head.appendChild(s);
//     }
//   }

//   private initCharts() {
//     const ChartLib = (window as any).Chart;
//     if (!ChartLib) return;

//     const makeChart = (id: string, data: any, options: any) => {
//       const el = document.getElementById(id) as HTMLCanvasElement | null;
//       if (!el) return;
//       const ctx = el.getContext('2d');
//       if (!ctx) return;
//       new ChartLib(el, { ...data, options });
//     };

//     // Example chart #1 (featureYoyChart)
//     makeChart(
//       'featureYoyChart',
//       {
//         type: 'line',
//         data: {
//           labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//           datasets: [
//             {
//               data: [18, 25, 38, 48, 62, 71],
//               borderColor: 'rgba(163,230,53,0.9)',
//               backgroundColor: 'rgba(163,230,53,0.5)',
//               tension: 0.35,
//               fill: true,
//               pointRadius: 0
//             },
//             {
//               data: [15, 18, 22, 28, 32, 38],
//               borderColor: 'rgba(255,255,255,0.25)',
//               tension: 0.35,
//               fill: false,
//               borderDash: [6, 6],
//               pointRadius: 0
//             }
//           ]
//         }
//       },
//       {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: { legend: { display: false }, tooltip: { enabled: false } },
//         scales: {
//           x: { grid: { color: 'rgba(255,255,255,0.05)' } },
//           y: { grid: { color: 'rgba(255,255,255,0.05)' } }
//         }
//       }
//     );

//     // Example chart #2 (velocityChart)
//     makeChart(
//       'velocityChart',
//       {
//         type: 'line',
//         data: {
//           labels: [
//             'Week 1',
//             'Week 2',
//             'Week 3',
//             'Week 4',
//             'Week 5',
//             'Week 6',
//             'Week 7',
//             'Week 8'
//           ],
//           datasets: [
//             {
//               data: [12, 28, 45, 68, 82, 92, 98, 100],
//               borderColor: 'rgba(163,230,53,0.9)',
//               backgroundColor: 'rgba(163,230,53,0.3)',
//               tension: 0.4,
//               fill: true,
//               pointRadius: 0
//             },
//             {
//               data: [8, 12, 18, 22, 28, 32, 38, 42],
//               borderColor: 'rgba(255,255,255,0.3)',
//               tension: 0.4,
//               fill: false,
//               borderDash: [8, 4],
//               pointRadius: 0
//             }
//           ]
//         }
//       },
//       {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: { legend: { display: false }, tooltip: { enabled: false } }
//       }
//     );
//   }

//   private initCarousel() {
//     const cards = document.querySelectorAll('.carousel-card');
//     const prevBtn = document.getElementById('teamPrevBtn');
//     const nextBtn = document.getElementById('teamNextBtn');
//     let currentIndex = 2;

// const update = () => {
//   cards.forEach((card, i) => {
//     const rel = i - currentIndex;
//     const el = card as HTMLElement;

//     // Position, scale, and rotation
//     el.style.transform = `translateX(${rel * 220}px) scale(${rel === 0 ? 1 : 0.9}) rotateY(${rel * -10}deg)`;

//     // Opacity and brightness for depth
//     const isActive = rel === 0;
//     const isVisible = Math.abs(rel) <= 2;

//     el.style.opacity = isActive ? '1' : isVisible ? '0.6' : '0';
//     el.style.filter = isActive ? 'brightness(1)' : 'brightness(0.6)';
//     el.style.zIndex = String(10 - Math.abs(rel));
//     el.style.transition = 'all 0.8s ease';

//     // Soft fade-out for hidden cards
//     if (isVisible) {
//       el.style.pointerEvents = 'auto';
//       el.style.visibility = 'visible';
//     } else {
//       // wait until opacity fades out before setting hidden
//       setTimeout(() => {
//         if (Math.abs(i - currentIndex) > 2) el.style.visibility = 'hidden';
//       }, 500);
//     }

//     // Glow for active card
//     el.style.boxShadow = isActive
//       ? '0 20px 60px rgba(163,230,53,0.4)'
//       : 'none';
//   });
// };


//     prevBtn?.addEventListener('click', () => {
//       currentIndex = (currentIndex - 1 + cards.length) % cards.length;
//       update();
//     });
//     nextBtn?.addEventListener('click', () => {
//       currentIndex = (currentIndex + 1) % cards.length;
//       update();
//     });
//     update();
//   }

//   private initMenuToggle() {
//     const btn = document.getElementById('menuBtn');
//     const menu = document.getElementById('mobileMenu');
//     btn?.addEventListener('click', () => menu?.classList.toggle('hidden'));
//   }

//   private initBillingToggle() {
//     const toggle = document.getElementById('billingToggle');
//     const starter = document.getElementById('starterPrice');
//     const pro = document.getElementById('proPrice');
//     if (!toggle || !starter || !pro) return;

//     toggle.addEventListener('click', () => {
//       const isYearly = toggle.getAttribute('aria-pressed') === 'false';
//       toggle.setAttribute('aria-pressed', String(isYearly));
//       const knob = toggle.querySelector('span');
//       if (knob) knob.style.transform = isYearly ? 'translateX(1.25rem)' : 'translateX(0)';
//       starter.textContent = '$0';
//       pro.textContent = isYearly ? '$37' : '$49';
//     });
//   }

//   private initIntersectionAnimations() {
//     const observer = new IntersectionObserver(
//       entries => {
//         entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible'));
//       },
//       { threshold: 0.1 }
//     );
//     document
//       .querySelectorAll('.animate-in, .animate-slide-left, .animate-slide-right, .animate-scale')
//       .forEach(el => observer.observe(el));
//   }

//   private initSmoothScroll() {
//     const menu = document.getElementById('mobileMenu');
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//       anchor.addEventListener('click', e => {
//         const href = (anchor as HTMLAnchorElement).getAttribute('href');
//         if (!href || href === '#') return;
//         const target = document.querySelector(href);
//         if (target) {
//           e.preventDefault();
//           target.scrollIntoView({ behavior: 'smooth', block: 'start' });
//           menu?.classList.add('hidden');
//         }
//       });
//     });
//   }

// private initKaraoke() {
//   const wrapWords = (el: HTMLElement) => {
//     if (el.dataset['karaokeWrapped']) return;
//     const words = el.textContent?.split(/\s+/) ?? [];
//     el.innerHTML = words.map(w => `<span class="karaoke-word">${w}</span>`).join(' ');
//     el.dataset['karaokeWrapped'] = 'true';
//   };

//   const animate = (el: HTMLElement) => {
//     const words = el.querySelectorAll('.karaoke-word');
//     words.forEach((w, i) => {
//       setTimeout(() => (w as HTMLElement).classList.add('is-active'), i * 80);
//     });
//   };

//   const observer = new IntersectionObserver(
//     entries => {
//       entries.forEach(e => {
//         if (e.isIntersecting) {
//           const t = e.target as HTMLElement;
//           animate(t);
//         }
//       });
//     },
//     { threshold: 0.3 }
//   );

//   document
//     .querySelectorAll('section h1, section h2, section p.text-neutral-300')
//     .forEach(el => {
//       wrapWords(el as HTMLElement);
//       observer.observe(el);
//     });
// }

//   private initTitleAnimations() {
//     const observer = new IntersectionObserver(
//       entries => {
//         entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible'));
//       },
//       { threshold: 0.3 }
//     );
//     document
//       .querySelectorAll('.animate-title-line, .animate-subtitle-line')
//       .forEach(el => observer.observe(el));
//   }
// }



import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TemplatesService, Template } from '../../../core/services/templates.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit, AfterViewInit {

  templates: Template[] = [];
  currentIndex = 1;

  constructor(private templateService: TemplatesService) {}

  /** 🧩 Fetch templates and handle Base64 images safely */
  ngOnInit(): void {
    this.templateService.getTemplates().subscribe({
      next: (res: Template[]) => {
        this.templates = res.map((t: Template) => ({
          ...t,
          previewImage: this.convertBase64ToUrl(t.previewImage)
        }));
        console.log('Templates loaded:', this.templates);
      },
      error: (err) => console.error('Error loading templates', err)
    });
  }

  /** 🧠 Initialize all animations and UI behavior after DOM loads */
  ngAfterViewInit(): void {
    this.loadUnicornStudio();
    this.initCharts();
    this.initCarousel();
    this.initMenuToggle();
    this.initBillingToggle();
    this.initIntersectionAnimations();
    this.initSmoothScroll();
    this.initKaraoke();
    this.initTitleAnimations();
  }

  // ------------------------------
  // ⚙️ Template Carousel Logic
  // ------------------------------

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.templates.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.templates.length) % this.templates.length;
  }

  getCardStyle(i: number) {
    const rel = i - this.currentIndex;
    const isActive = rel === 0;
    const isVisible = Math.abs(rel) <= 2;

    return {
      transform: `translateX(${rel * 220}px) scale(${isActive ? 1 : 0.9}) rotateY(${rel * -10}deg)`,
      opacity: isActive ? '1' : isVisible ? '0.6' : '0',
      filter: `brightness(${isActive ? 1 : 0.6})`,
      zIndex: String(10 - Math.abs(rel)),
      transition: 'all 0.8s ease',
      visibility: isVisible ? 'visible' : 'hidden',
      boxShadow: isActive ? '0 20px 60px rgba(163,230,53,0.4)' : 'none',
    };
  }

  // ------------------------------
  // 🧩 Base64 → Blob Conversion
  // ------------------------------

  private convertBase64ToUrl(base64: string): string {
    if (!base64) return '';

    const mimeType = this.detectMimeType(base64);
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  private detectMimeType(base64: string): string {
    if (base64.startsWith('data:image/png')) return 'image/png';
    if (base64.startsWith('data:image/jpeg')) return 'image/jpeg';
    if (base64.startsWith('data:image/webp')) return 'image/webp';
    return 'image/png';
  }

  // ------------------------------
  // 🌈 UI & Animation Utilities
  // ------------------------------

  private loadUnicornStudio() {
    if (!(window as any).UnicornStudio) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
      s.onload = () => (window as any).UnicornStudio?.init?.();
      document.head.appendChild(s);
    }
  }

  private initCharts() {
    const ChartLib = (window as any).Chart;
    if (!ChartLib) return;

    const makeChart = (id: string, data: any, options: any) => {
      const el = document.getElementById(id) as HTMLCanvasElement | null;
      if (!el) return;
      const ctx = el.getContext('2d');
      if (!ctx) return;
      new ChartLib(el, { ...data, options });
    };

    makeChart(
      'featureYoyChart',
      {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { data: [18, 25, 38, 48, 62, 71], borderColor: 'rgba(163,230,53,0.9)', backgroundColor: 'rgba(163,230,53,0.5)', tension: 0.35, fill: true, pointRadius: 0 },
            { data: [15, 18, 22, 28, 32, 38], borderColor: 'rgba(255,255,255,0.25)', tension: 0.35, fill: false, borderDash: [6, 6], pointRadius: 0 }
          ]
        }
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } }
      }
    );
  }

  private initCarousel() {
    const cards = document.querySelectorAll('.carousel-card');
    const prevBtn = document.getElementById('teamPrevBtn');
    const nextBtn = document.getElementById('teamNextBtn');
    let currentIndex = 2;

    const update = () => {
      cards.forEach((card, i) => {
        const rel = i - currentIndex;
        const el = card as HTMLElement;

        el.style.transform = `translateX(${rel * 220}px) scale(${rel === 0 ? 1 : 0.9}) rotateY(${rel * -10}deg)`;
        const isActive = rel === 0;
        const isVisible = Math.abs(rel) <= 2;

        el.style.opacity = isActive ? '1' : isVisible ? '0.6' : '0';
        el.style.filter = isActive ? 'brightness(1)' : 'brightness(0.6)';
        el.style.zIndex = String(10 - Math.abs(rel));
        el.style.transition = 'all 0.8s ease';

        if (isVisible) {
          el.style.pointerEvents = 'auto';
          el.style.visibility = 'visible';
        } else {
          setTimeout(() => {
            if (Math.abs(i - currentIndex) > 2) el.style.visibility = 'hidden';
          }, 500);
        }

        el.style.boxShadow = isActive ? '0 20px 60px rgba(163,230,53,0.4)' : 'none';
      });
    };

    prevBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      update();
    });
    nextBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cards.length;
      update();
    });
    update();
  }

  private initMenuToggle() {
    const btn = document.getElementById('menuBtn');
    const menu = document.getElementById('mobileMenu');
    btn?.addEventListener('click', () => menu?.classList.toggle('hidden'));
  }

  private initBillingToggle() {
    const toggle = document.getElementById('billingToggle');
    const starter = document.getElementById('starterPrice');
    const pro = document.getElementById('proPrice');
    if (!toggle || !starter || !pro) return;

    toggle.addEventListener('click', () => {
      const isYearly = toggle.getAttribute('aria-pressed') === 'false';
      toggle.setAttribute('aria-pressed', String(isYearly));
      const knob = toggle.querySelector('span');
      if (knob) knob.style.transform = isYearly ? 'translateX(1.25rem)' : 'translateX(0)';
      starter.textContent = '$0';
      pro.textContent = isYearly ? '$37' : '$49';
    });
  }

  private initIntersectionAnimations() {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    document
      .querySelectorAll('.animate-in, .animate-slide-left, .animate-slide-right, .animate-scale')
      .forEach(el => observer.observe(el));
  }

  private initSmoothScroll() {
    const menu = document.getElementById('mobileMenu');
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          menu?.classList.add('hidden');
        }
      });
    });
  }

  private initKaraoke() {
    const wrapWords = (el: HTMLElement) => {
      if (el.dataset['karaokeWrapped']) return;
      const words = el.textContent?.split(/\s+/) ?? [];
      el.innerHTML = words.map(w => `<span class="karaoke-word">${w}</span>`).join(' ');
      el.dataset['karaokeWrapped'] = 'true';
    };

    const animate = (el: HTMLElement) => {
      const words = el.querySelectorAll('.karaoke-word');
      words.forEach((w, i) => setTimeout(() => (w as HTMLElement).classList.add('is-active'), i * 80));
    };

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && animate(e.target as HTMLElement)),
      { threshold: 0.3 }
    );

    document.querySelectorAll('section h1, section h2, section p.text-neutral-300')
      .forEach(el => { wrapWords(el as HTMLElement); observer.observe(el); });
  }

  private initTitleAnimations() {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.3 }
    );
    document
      .querySelectorAll('.animate-title-line, .animate-subtitle-line')
      .forEach(el => observer.observe(el));
  }
}
