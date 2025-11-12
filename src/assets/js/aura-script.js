// !function(){if(!window.UnicornStudio){window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js",i.onload=function(){window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)},(document.head || document.body).appendChild(i)}}();


//         (function() {
//           const el = document.getElementById('featureYoyChart');
//           if (!el || typeof Chart === 'undefined') return;
//           const ctx = el.getContext('2d');
//           const grad = ctx.createLinearGradient(0, 0, 0, 120);
//           grad.addColorStop(0, 'rgba(163,230,53,0.5)');
//           grad.addColorStop(1, 'rgba(163,230,53,0.02)');
//           new Chart(el, {
//             type: 'line',
//             data: {
//               labels: ['Jan','Feb','Mar','Apr','May','Jun'],
//               datasets: [{
//                 data: [18, 25, 38, 48, 62, 71],
//                 borderColor: 'rgba(163,230,53,0.9)',
//                 backgroundColor: grad,
//                 tension: 0.35,
//                 fill: true,
//                 pointRadius: 0
//               },{
//                 data: [15, 18, 22, 28, 32, 38],
//                 borderColor: 'rgba(255,255,255,0.25)',
//                 tension: 0.35,
//                 fill: false,
//                 borderDash: [6,6],
//                 pointRadius: 0
//               }]
//             },
//             options: {
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: { legend: { display: false }, tooltip: { enabled: false } },
//               scales: {
//                 x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } } },
//                 y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false } }
//               }
//             }
//           });
//         })();
      


//         (function () {
//           const cards = [
//             { name: 'Sofia Alvarez', role: 'Growth Lead', img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=1200&q=80&auto=format&fit=crop' },
//             { name: 'Jackson Mitchel', role: 'AI Lead', img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=1200&q=80&auto=format&fit=crop' },
//             { name: 'John Doe', role: 'Product Head', img: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=1200&q=80&auto=format&fit=crop' },
//             { name: 'Armenia Sean', role: 'Social Media Head', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80&auto=format&fit=crop' },
//             { name: 'Maya Patel', role: 'Design Lead', img: 'https://images.unsplash.com/photo-1541534401786-2077eed87a2d?w=1200&q=80&auto=format&fit=crop' },
//             { name: 'Liam Becker', role: 'Platform Engineer', img: 'https://images.unsplash.com/photo-1544005316-04d7f94c1d27?w=1200&q=80&auto=format&fit=crop' }
//           ];

//           let currentIndex = 2;
//           const prevBtn = document.getElementById('teamPrevBtn');
//           const nextBtn = document.getElementById('teamNextBtn');
//           const carouselCards = document.querySelectorAll('.carousel-card');

//           function updateCarousel() {
//             carouselCards.forEach((card, i) => {
//               const relativePos = i - currentIndex;
//               let transform = '';
//               let opacity = 1;
//               let filter = 'brightness(1)';
//               let zIndex = 1;
//               let ringClass = 'ring-1 ring-white/10';
//               let shadow = '';

//               if (relativePos === 0) {
//                 transform = 'translateX(0) scale(1) rotateY(0deg)';
//                 opacity = 1;
//                 zIndex = 10;
//                 ringClass = 'ring-2 ring-lime-300/40';
//                 shadow = '0 20px 60px rgba(163,230,53,0.3)';
//               } else if (relativePos === -1) {
//                 transform = 'translateX(-180px) scale(0.9) rotateY(10deg)';
//                 opacity = 0.6;
//                 filter = 'brightness(0.75)';
//                 zIndex = 5;
//               } else if (relativePos === 1) {
//                 transform = 'translateX(180px) scale(0.9) rotateY(-10deg)';
//                 opacity = 0.6;
//                 filter = 'brightness(0.75)';
//                 zIndex = 5;
//               } else if (relativePos === -2) {
//                 transform = 'translateX(-360px) scale(0.85) rotateY(20deg)';
//                 opacity = 0.4;
//                 filter = 'brightness(0.6)';
//                 zIndex = 2;
//               } else if (relativePos === 2) {
//                 transform = 'translateX(360px) scale(0.85) rotateY(-20deg)';
//                 opacity = 0.4;
//                 filter = 'brightness(0.6)';
//                 zIndex = 2;
//               } else {
//                 transform = `translateX(${relativePos * 180}px) scale(0.75) rotateY(${-relativePos * 15}deg)`;
//                 opacity = 0;
//                 filter = 'brightness(0.5)';
//                 zIndex = 1;
//               }

//               card.style.transform = transform;
//               card.style.opacity = opacity;
//               card.style.filter = filter;
//               card.style.zIndex = zIndex;
//               card.style.boxShadow = shadow;
//               card.className = `carousel-card absolute w-80 h-[460px] rounded-2xl overflow-hidden ${ringClass} ${relativePos === 0 ? 'bg-lime-400/10' : ''} transition-all duration-500`;
//             });
//           }

//           if (prevBtn) {
//             prevBtn.addEventListener('click', () => {
//               currentIndex = (currentIndex - 1 + cards.length) % cards.length;
//               updateCarousel();
//             });
//           }

//           if (nextBtn) {
//             nextBtn.addEventListener('click', () => {
//               currentIndex = (currentIndex + 1) % cards.length;
//               updateCarousel();
//             });
//           }

//           updateCarousel();
//         })();
      


//       // Initialize Lucide icons
//       if (typeof lucide !== 'undefined') {
//         lucide.createIcons();
//       }

//       // Mobile menu toggle
//       const menuBtn = document.getElementById('menuBtn');
//       const mobileMenu = document.getElementById('mobileMenu');
//       if (menuBtn && mobileMenu) {
//         menuBtn.addEventListener('click', () => {
//           mobileMenu.classList.toggle('hidden');
//         });
//       }

//       // Billing toggle
//       const billingToggle = document.getElementById('billingToggle');
//       const starterPrice = document.getElementById('starterPrice');
//       const proPrice = document.getElementById('proPrice');
//       if (billingToggle && starterPrice && proPrice) {
//         billingToggle.addEventListener('click', () => {
//           const isYearly = billingToggle.getAttribute('aria-pressed') === 'false';
//           billingToggle.setAttribute('aria-pressed', isYearly);
//           const toggle = billingToggle.querySelector('span');
//           if (toggle) {
//             toggle.style.transform = isYearly ? 'translateX(1.25rem)' : 'translateX(0)';
//           }
//           starterPrice.textContent = '$0';
//           proPrice.textContent = isYearly ? '$37' : '$49';
//         });
//       }

//       // Intersection Observer for animations
//       const observerOptions = {
//         root: null,
//         rootMargin: '0px',
//         threshold: 0.1
//       };

//       const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add('is-visible');
//           }
//         });
//       }, observerOptions);

//       document.querySelectorAll('.animate-in, .animate-slide-left, .animate-slide-right, .animate-scale').forEach(el => {
//         observer.observe(el);
//       });

//       // Chart.js initialization
//       (function() {
//         const el = document.getElementById('velocityChart');
//         if (!el || typeof Chart === 'undefined') return;
//         const ctx = el.getContext('2d');
//         const gradient = ctx.createLinearGradient(0, 0, 0, 140);
//         gradient.addColorStop(0, 'rgba(163,230,53,0.6)');
//         gradient.addColorStop(1, 'rgba(163,230,53,0.02)');
//         new Chart(el, {
//           type: 'line',
//           data: {
//             labels: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8'],
//             datasets: [{
//               label: 'With Synthesize',
//               data: [12, 28, 45, 68, 82, 92, 98, 100],
//               borderColor: 'rgba(163,230,53,0.9)',
//               backgroundColor: gradient,
//               tension: 0.4,
//               fill: true,
//               pointRadius: 0,
//               borderWidth: 2
//             },{
//               label: 'Traditional',
//               data: [8, 12, 18, 22, 28, 32, 38, 42],
//               borderColor: 'rgba(255,255,255,0.3)',
//               backgroundColor: 'transparent',
//               tension: 0.4,
//               fill: false,
//               borderDash: [8,4],
//               pointRadius: 0,
//               borderWidth: 2
//             }]
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//               legend: { display: false },
//               tooltip: { enabled: false }
//             },
//             scales: {
//               x: {
//                 grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
//                 ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }
//               },
//               y: {
//                 grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
//                 ticks: { display: false }
//               }
//             }
//           }
//         });
//       })();

//       // Smooth scroll for anchor links
//       document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', function (e) {
//           const href = this.getAttribute('href');
//           if (href !== '#' && href !== '#cta') {
//             e.preventDefault();
//             const target = document.querySelector(href);
//             if (target) {
//               target.scrollIntoView({ behavior: 'smooth', block: 'start' });
//               // Close mobile menu if open
//               if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
//                 mobileMenu.classList.add('hidden');
//               }
//             }
//           }
//         });
//       });
    


//       (function() {
//         const lineRiseObserver = new IntersectionObserver((entries) => {
//           entries.forEach(entry => {
//             if (entry.isIntersecting) {
//               entry.target.classList.add('is-visible');
//             }
//           });
//         }, { threshold: 0.2 });

//         document.querySelectorAll('.animate-line-rise, .animate-subtitle-rise').forEach(el => {
//           lineRiseObserver.observe(el);
//         });
//       })();
    


//       (function() {
//         function wrapWordsForKaraoke(element) {
//           if (element.dataset.karaokeWrapped) return;
//           const text = element.textContent;
//           const words = text.split(/\s+/);
//           element.innerHTML = words.map(word => `<span class="karaoke-word">${word}</span>`).join(' ');
//           element.classList.add('karaoke-container');
//           element.dataset.karaokeWrapped = 'true';
//         }

//         function animateKaraoke(element) {
//           const words = element.querySelectorAll('.karaoke-word');
//           if (!words.length) return;

//           element.classList.add('is-animating');

//           words.forEach((word, index) => {
//             setTimeout(() => {
//               word.classList.add('is-active');
//               setTimeout(() => {
//                 word.classList.remove('is-active');
//                 word.classList.add('is-completed');
//                 if (index === words.length - 1) {
//                   element.classList.remove('is-animating');
//                 }
//               }, 150);
//             }, index * 80);
//           });
//         }

//         const karaokeObserver = new IntersectionObserver((entries) => {
//           entries.forEach(entry => {
//             if (entry.isIntersecting && !entry.target.dataset.karaokeAnimated) {
//               entry.target.dataset.karaokeAnimated = 'true';
//               animateKaraoke(entry.target);
//             }
//           });
//         }, { threshold: 0.3 });

//         function initKaraoke() {
//           const selectors = [
//             'section h1',
//             'section h2',
//             'section h3',
//             'section p.text-neutral-300',
//             'section p.text-neutral-400',
//             'section p.text-base',
//             'section p.text-lg',
//             'section p.text-sm'
//           ];

//           selectors.forEach(selector => {
//             document.querySelectorAll(selector).forEach(element => {
//               if (element.closest('footer')) return;
//               if (element.closest('header')) return;
//               if (element.closest('form')) return;
//               if (element.closest('details')) return;
//               if (element.querySelector('svg')) return;
//               if (element.querySelector('button')) return;
//               if (element.querySelector('a')) return;

//               wrapWordsForKaraoke(element);
//               karaokeObserver.observe(element);
//             });
//           });
//         }

//         if (document.readyState === 'loading') {
//           document.addEventListener('DOMContentLoaded', initKaraoke);
//         } else {
//           initKaraoke();
//         }
//       })();
    


//       (function() {
//         const titleObserver = new IntersectionObserver((entries) => {
//           entries.forEach(entry => {
//             if (entry.isIntersecting) {
//               entry.target.classList.add('is-visible');
//             }
//           });
//         }, { threshold: 0.3 });

//         document.querySelectorAll('.animate-title-line, .animate-subtitle-line').forEach(el => {
//           titleObserver.observe(el);
//         });
//       })();
    