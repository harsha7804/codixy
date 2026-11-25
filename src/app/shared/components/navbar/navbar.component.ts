import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollService } from '../../../core/services/scroll.service';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <header
      #header
      class="site-header fixed top-0 left-0 right-0 z-[100]"
      [class.scrolled]="isScrolled"
    >
      <!-- Background layer: blur always applied, only opacity animates (GPU, no flicker) -->
      <div class="header-bg" aria-hidden="true"></div>
      <div class="section-container">
        <nav class="flex items-center justify-between h-16 md:h-20">
          <!-- Logo -->
          <div class="logo-wrap flex items-center gap-3 cursor-pointer" (click)="scrollToTop()">
            <div class="logo-img-wrap relative">
              <img
                src="assets/logo/codixy-logo.jpg"
                alt="CODIXY Technologies"
                class="h-10 md:h-14 w-auto object-contain rounded-md"
                style="filter: drop-shadow(0 0 8px rgba(6,182,212,0.5));"
              >
            </div>
          </div>

          <!-- Desktop Nav Links -->
          <ul class="hidden lg:flex items-center gap-8" role="navigation">
            <li *ngFor="let item of navItems">
              <a
                [href]="item.href"
                class="nav-link relative text-slate-300 hover:text-white font-medium text-[14px] tracking-wide transition-all duration-300 font-grotesk"
                (click)="handleNavClick($event, item.href)"
              >
                {{item.label}}
                <span class="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 group-hover:w-full nav-underline"></span>
              </a>
            </li>
          </ul>

          <!-- CTA + Hamburger -->
          <div class="flex items-center gap-4">
            <a
              href="#contact"
              class="nav-cta btn-primary text-sm px-6 py-3"
              (click)="handleNavClick($event, '#contact')"
            >
              <span>Get in Touch</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>

            <!-- Hamburger -->
            <button
              class="lg:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
              (click)="toggleMobileMenu()"
              [attr.aria-expanded]="isMobileOpen"
              aria-label="Toggle menu"
            >
              <span class="block h-[2px] bg-white rounded transition-all duration-300"
                [style.width]="isMobileOpen ? '24px' : '24px'"
                [style.transform]="isMobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'">
              </span>
              <span class="block h-[2px] bg-white rounded transition-all duration-300 w-[18px]"
                [style.opacity]="isMobileOpen ? '0' : '1'"
                [style.transform]="isMobileOpen ? 'translateX(10px)' : 'none'">
              </span>
              <span class="block h-[2px] bg-white rounded transition-all duration-300"
                [style.width]="isMobileOpen ? '24px' : '24px'"
                [style.transform]="isMobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'">
              </span>
            </button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" [class.open]="isMobileOpen">
      <!-- Background glow -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Close button -->
      <button
        class="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
        (click)="toggleMobileMenu()"
        aria-label="Close menu"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Mobile Logo -->
      <div class="mb-12">
        <img src="assets/logo/codixy-logo.jpg" alt="CODIXY" class="h-12 w-auto mx-auto"
          style="filter: drop-shadow(0 0 10px rgba(6,182,212,0.6));">
      </div>

      <!-- Mobile Nav Items -->
      <ul class="flex flex-col items-center gap-6 relative z-10">
        <li *ngFor="let item of navItems; let i = index">
          <a
            [href]="item.href"
            class="text-2xl font-grotesk font-semibold text-white hover:text-cyan-400 transition-colors duration-300 tracking-wide"
            (click)="handleNavClick($event, item.href); toggleMobileMenu()"
          >
            {{item.label}}
          </a>
        </li>
      </ul>

      <!-- Mobile CTA -->
      <div class="mt-12 relative z-10">
        <a href="#contact" class="btn-primary text-base px-8 py-4"
          (click)="handleNavClick($event, '#contact'); toggleMobileMenu()">
          <span>Get in Touch</span>
          <svg class="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>

      <!-- Social Icons -->
      <div class="mt-8 flex gap-4 relative z-10">
        <a *ngFor="let social of socials" [href]="social.url" target="_blank"
          class="w-10 h-10 glass-card flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-300"
          [attr.aria-label]="social.name">
          <span [innerHTML]="social.icon | safeHtml"></span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .nav-link:hover .nav-underline,
    .nav-link.active .nav-underline { width: 100%; }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #06b6d4, #7c3aed);
      transition: width 0.3s ease;
    }

    .nav-link:hover::after { width: 100%; }

    .site-header {
      padding-top: env(safe-area-inset-top);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
    .nav-cta { display: none !important; }
    @media (min-width: 1024px) { .nav-cta { display: inline-flex !important; } }
    .header-bg {
      position: absolute; inset: 0; z-index: -1; pointer-events: none;
      background: rgba(3,7,18,0.92);
      -webkit-backdrop-filter: blur(24px); backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 4px 30px rgba(0,0,0,0.4);
      opacity: 0;
      transition: opacity 0.4s ease;
      will-change: opacity;
    }
    .site-header.scrolled .header-bg { opacity: 1; }

    .logo-img-wrap {
      transition: filter 0.3s ease;
    }

    .logo-img-wrap:hover {
      filter: drop-shadow(0 0 12px rgba(6,182,212,0.8));
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('header') headerEl!: ElementRef;
  isScrolled = false;
  isMobileOpen = false;

  navItems = [
    { label: 'Services', href: '#services' },
    { label: 'Technologies', href: '#technologies' },
    { label: 'About', href: '#about' },
    { label: 'Leadership', href: '#leadership' },
    { label: 'Contact', href: '#contact' },
  ];

  socials = [
    { name: 'LinkedIn', url: '#', icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
    { name: 'Twitter', url: '#', icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
    { name: 'Instagram', url: '#', icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' },
  ];

  private onScrollBound = () => this.onScroll();

  constructor(private scrollService: ScrollService, private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.zone.runOutsideAngular(() =>
      window.addEventListener('scroll', this.onScrollBound, { passive: true }));
    this.onScroll();
    gsap.fromTo('header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScrollBound);
  }

  // Listens outside Angular; only re-renders when the state actually flips.
  private onScroll(): void {
    const scrolled = window.scrollY > 50;
    if (scrolled !== this.isScrolled) {
      this.zone.run(() => { this.isScrolled = scrolled; this.cdr.markForCheck(); });
    }
  }

  scrollToTop(): void {
    this.scrollService.scrollTo(0, { duration: 1.5 });
  }

  handleNavClick(e: Event, href: string): void {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      this.scrollService.scrollTo(target as HTMLElement, { offset: -80, duration: 1.5 });
    }
  }

  toggleMobileMenu(): void {
    this.isMobileOpen = !this.isMobileOpen;
    document.body.style.overflow = this.isMobileOpen ? 'hidden' : '';
  }
}
