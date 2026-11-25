import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationService } from '../../core/services/animation.service';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <section id="about" class="relative py-28 md:py-40 overflow-hidden bg-[#030712]">
      <!-- Background elements -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>

      <div class="section-container relative z-10">

        <!-- Section Header -->
        <div #aboutHeader class="text-center mb-20 reveal-up">
          <div class="section-tag mx-auto mb-6">
            <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            About CODIXY
          </div>
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-6 font-grotesk leading-tight">
            We Build Tomorrow's<br>
            <span class="gradient-text">Digital Solutions Today</span>
          </h2>
          <p class="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed font-outfit">
            CODIXY Technologies is an innovative IT solutions company specializing in modern web applications,
            enterprise software, AI-powered automation, and scalable digital platforms.
          </p>
        </div>

        <!-- Mission & Vision Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <!-- Mission -->
          <div #missionCard class="glass-card glass-card-hover spotlight-card p-8 md:p-10 reveal-left relative overflow-hidden group animate-float" style="animation-delay: 0s;">
            <!-- Animated glowing border -->
            <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style="background: linear-gradient(135deg, rgba(6,182,212,0.2), transparent); border: 1px solid rgba(6,182,212,0.4);"></div>
            <!-- Internal Glow -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 blur-2xl rounded-full pointer-events-none"></div>
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center"
                style="background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05)); border: 1px solid rgba(6,182,212,0.3);">
                <svg class="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 #missionTitle class="text-2xl font-bold text-white font-grotesk opacity-0 translate-y-4">Our Mission</h3>
            </div>
            <p class="text-slate-400 leading-relaxed font-outfit relative z-10">
              To empower businesses through innovative technology solutions, intelligent automation, and
              future-ready digital experiences. We strive to deliver scalable, secure, and high-performance
              software that drives growth, enhances user engagement, and accelerates digital transformation
              for organizations worldwide.
            </p>
            <!-- Glow line -->
            <div class="mt-8 h-px" style="background: linear-gradient(90deg, rgba(6,182,212,0.5), transparent)"></div>
          </div>

          <!-- Vision -->
          <div #visionCard class="glass-card glass-card-hover spotlight-card p-8 md:p-10 reveal-right relative overflow-hidden group animate-float" style="animation-delay: 1.5s;">
            <!-- Animated glowing border -->
            <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style="background: linear-gradient(135deg, rgba(124,58,237,0.2), transparent); border: 1px solid rgba(124,58,237,0.4);"></div>
            <!-- Internal Glow -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full pointer-events-none"></div>
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center"
                style="background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05)); border: 1px solid rgba(124,58,237,0.3);">
                <svg class="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <h3 #visionTitle class="text-2xl font-bold text-white font-grotesk opacity-0 translate-y-4">Our Vision</h3>
            </div>
            <p class="text-slate-400 leading-relaxed font-outfit relative z-10">
              To become a globally recognized technology company known for innovation, futuristic digital
              solutions, and transformative software experiences. We aim to shape the future of technology
              by helping businesses evolve through intelligent systems, cutting-edge development, and
              human-centered digital innovation.
            </p>
            <div class="mt-8 h-px" style="background: linear-gradient(90deg, rgba(124,58,237,0.5), transparent)"></div>
          </div>
        </div>

        <!-- Core Values -->
        <div #valuesSection>
          <h3 class="text-center text-2xl font-bold text-white mb-12 font-grotesk">Core Values</h3>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6" #valuesGrid>
            <div *ngFor="let value of coreValues; let i = index"
              class="glass-card glass-card-hover p-4 sm:p-6 text-center group cursor-default value-card relative overflow-hidden">
              <!-- Animated panning gradient background -->
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   [style.background]="'linear-gradient(120deg, ' + value.colorA + ' 0%, transparent 50%, ' + value.colorB + ' 100%)'"
                   style="background-size: 200% 200%; animation: panGradient 6s linear infinite;"></div>
              
              <!-- Abstract Illustration background -->
              <div class="absolute top-0 left-0 right-0 h-24 opacity-10 pointer-events-none flex justify-center items-end" [innerHTML]="value.bgIllustration | safeHtml"></div>

              <!-- Icon -->
              <div class="relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl mx-auto mb-3 sm:mb-5 flex items-center justify-center transition-all duration-400"
                [style.background]="'linear-gradient(135deg, ' + value.colorA + ', ' + value.colorB + ')'"
                [style.border]="'1px solid ' + value.borderColor">
                <span [innerHTML]="value.icon | safeHtml" class="transition-transform duration-400 group-hover:scale-110"></span>
              </div>
              <h4 class="relative z-10 text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3 font-grotesk">{{value.title}}</h4>
              <p class="relative z-10 text-slate-400 text-xs sm:text-sm leading-relaxed font-outfit">{{value.description}}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    @keyframes panGradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `]
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('aboutHeader') aboutHeaderRef!: ElementRef;
  @ViewChild('missionCard') missionRef!: ElementRef;
  @ViewChild('visionCard') visionRef!: ElementRef;
  @ViewChild('missionTitle') missionTitleRef!: ElementRef;
  @ViewChild('visionTitle') visionTitleRef!: ElementRef;
  @ViewChild('valuesGrid') valuesGridRef!: ElementRef;

  coreValues = [
    {
      title: 'Innovation',
      description: 'We constantly push the boundaries of what\'s possible with technology.',
      icon: '<svg class="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
      bgIllustration: '<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,100 C20,80 40,90 60,70 C80,50 100,80 100,80 L100,0 L0,0 Z" fill="rgba(6,182,212,0.2)"/></svg>',
      colorA: 'rgba(6,182,212,0.15)', colorB: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.3)'
    },
    {
      title: 'Excellence',
      description: 'We deliver premium quality solutions that exceed client expectations.',
      icon: '<svg class="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>',
      bgIllustration: '<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,80 C30,100 70,60 100,90 L100,0 L0,0 Z" fill="rgba(124,58,237,0.2)"/></svg>',
      colorA: 'rgba(124,58,237,0.15)', colorB: 'rgba(124,58,237,0.05)', borderColor: 'rgba(124,58,237,0.3)'
    },
    {
      title: 'Transparency',
      description: 'Open and honest communication builds lasting client partnerships.',
      icon: '<svg class="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      bgIllustration: '<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,90 C40,70 60,100 100,60 L100,0 L0,0 Z" fill="rgba(37,99,235,0.2)"/></svg>',
      colorA: 'rgba(37,99,235,0.15)', colorB: 'rgba(37,99,235,0.05)', borderColor: 'rgba(37,99,235,0.3)'
    },
    {
      title: 'Agility',
      description: 'We adapt quickly to evolving market needs and emerging technologies.',
      icon: '<svg class="w-7 h-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      bgIllustration: '<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,70 C50,100 50,50 100,80 L100,0 L0,0 Z" fill="rgba(236,72,153,0.2)"/></svg>',
      colorA: 'rgba(236,72,153,0.15)', colorB: 'rgba(236,72,153,0.05)', borderColor: 'rgba(236,72,153,0.3)'
    },
  ];

  constructor(private animService: AnimationService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.animService.revealSection(this.aboutHeaderRef.nativeElement, { stagger: 0 });
      this.animService.revealLeft(this.missionRef.nativeElement);
      this.animService.revealRight(this.visionRef.nativeElement);

      // Entrance animation for titles
      gsap.to(this.missionTitleRef.nativeElement, {
        opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: this.missionRef.nativeElement, start: 'top 80%' }
      });
      gsap.to(this.visionTitleRef.nativeElement, {
        opacity: 1, y: 0, duration: 1, delay: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: this.visionRef.nativeElement, start: 'top 80%' }
      });

      this.animService.staggerReveal(this.valuesGridRef.nativeElement, '.value-card', { stagger: 0.12 });
    }, 100);
  }
}
