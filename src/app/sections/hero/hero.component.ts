import {
  Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="hero" class="relative min-h-[100svh] flex items-start md:items-center overflow-hidden bg-[#030712]">
      <!-- Three.js Particle Canvas -->
      <canvas #heroCanvas id="hero-canvas" class="absolute inset-0 w-full h-full gpu-layer"></canvas>

      <!-- Grid Background -->
      <div class="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

      <!-- Floating Tech Icons Overlay -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden md:block">
        <div *ngFor="let icon of techIcons" 
             class="absolute w-14 h-14 bg-slate-900/70 rounded-2xl border border-white/10 flex items-center justify-center animate-float gpu-layer transition-[transform,background-color] duration-500 hover:scale-125 hover:bg-white/10 pointer-events-auto cursor-pointer shadow-lg"
             [style.top]="icon.top" 
             [style.left]="icon.left" 
             [style.animation-delay]="icon.delay">
          <img [src]="icon.url" [alt]="icon.name" class="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity">
        </div>
      </div>

      <!-- Gradient Orbs -->
      <div class="hidden md:block absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none animate-float gpu-layer"></div>
      <div class="hidden md:block absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none animate-float-delay gpu-layer"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <!-- Content -->
      <div class="section-container relative z-10 w-full mt-[calc(6.5rem+env(safe-area-inset-top))] md:mt-32 mb-16 md:mb-20">
        <div class="max-w-5xl">
          <!-- Main Heading -->
          <h1 #heroHeading class="opacity-0 font-clash text-[2.6rem] sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] md:leading-[1.0] mb-5 md:mb-8 tracking-tight">
            <span class="block text-white">Transforming</span>
            <span class="block gradient-text text-glow-cyan">Digital Innovation</span>
            <span class="block text-white">Into Reality</span>
          </h1>

          <!-- Description -->
          <p #heroDesc class="opacity-0 text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-8 md:mb-10 font-outfit">
            CODIXY Technologies delivers AI-powered enterprise software, intelligent automation, and
            next-generation digital platforms that accelerate business growth.
          </p>

          <!-- CTA Buttons -->
          <div #heroCta class="opacity-0 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 mb-10 md:mb-16">
            <a href="#services" class="btn-primary justify-center whitespace-nowrap gap-2 text-sm sm:text-base px-3 sm:px-8 py-3.5 sm:py-4"
              (click)="scrollToSection($event, '#services')">
              <span>Explore Solutions</span>
              <svg class="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a href="#contact" class="btn-secondary justify-center whitespace-nowrap text-sm sm:text-base px-3 sm:px-8 py-3.5 sm:py-4"
              (click)="scrollToSection($event, '#contact')">
              <span>Get in Touch</span>
            </a>
          </div>

          <!-- Floating Stat Cards -->
          <div #heroStats class="opacity-0 grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl">
            <div *ngFor="let stat of stats"
              class="glass-card px-3 py-4 sm:px-6 sm:py-5 relative group hover:border-cyan-400/30 transition-colors duration-400 cursor-default text-center sm:text-left">
              <!-- Glow on hover -->
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
              <div class="relative z-10">
                <span class="stat-counter text-2xl sm:text-4xl font-bold">{{stat.value}}</span>
                <p class="text-slate-400 text-[11px] leading-tight sm:text-sm mt-1 font-outfit">{{stat.label}}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Gradient Fade -->
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none"></div>
    </section>
  `,
  styles: [`:host { display: block; }`]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroHeading') headingRef!: ElementRef;
  @ViewChild('heroDesc') descRef!: ElementRef;
  @ViewChild('heroCta') ctaRef!: ElementRef;
  @ViewChild('heroStats') statsRef!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private particles!: THREE.Points;
  private animFrameId!: number;
  private mouse = { x: 0, y: 0 };
  private visible = true;
  private observer?: IntersectionObserver;
  private onMouseMove = (e: MouseEvent) => {
    this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  private onResizeBound = () => this.onResize();

  stats = [
    { value: '125+', label: 'Projects Delivered' },
    { value: '50+', label: 'Happy Clients' },
    { value: '5+', label: 'Years of Excellence' },
  ];

  techIcons = [
    { name: 'Java', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', top: '15%', left: '10%', delay: '0s' },
    { name: 'Python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', top: '25%', left: '85%', delay: '1s' },
    { name: 'JavaScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', top: '45%', left: '8%', delay: '2.5s' },
    { name: 'TypeScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', top: '75%', left: '15%', delay: '1.5s' },
    { name: 'C++', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', top: '85%', left: '80%', delay: '3s' },
    { name: 'React', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', top: '20%', left: '75%', delay: '0.5s' },
    { name: 'Node.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', top: '65%', left: '88%', delay: '4s' },
    { name: 'Spring Boot', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg', top: '80%', left: '35%', delay: '2s' },
    { name: 'Next.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', top: '35%', left: '18%', delay: '3.5s' },
    { name: 'AWS', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg', top: '10%', left: '45%', delay: '1.2s' },
    { name: 'Docker', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', top: '55%', left: '12%', delay: '2.8s' },
    { name: 'Kubernetes', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', top: '50%', left: '82%', delay: '0.8s' },
    { name: 'MongoDB', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', top: '85%', left: '60%', delay: '4.5s' },
    { name: 'MySQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', top: '15%', left: '28%', delay: '1.8s' },
    { name: 'Git', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', top: '35%', left: '90%', delay: '3.2s' },
    { name: 'Firebase', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', top: '70%', left: '25%', delay: '2.2s' },
  ];

  constructor(private scrollService: ScrollService, private zone: NgZone) {}

  ngAfterViewInit(): void {
    // WebGL loop + listeners run outside Angular: no change detection per frame.
    this.zone.runOutsideAngular(() => {
      this.initThreeJS();
      this.animateHeroEntrance();
      this.trackMouse();
      // Stop rendering when the hero is off-screen so scrolling stays smooth.
      this.observer = new IntersectionObserver(([entry]) => {
        const wasVisible = this.visible;
        this.visible = entry.isIntersecting;
        if (this.visible && !wasVisible) this.animate();
      });
      this.observer.observe(this.canvasRef.nativeElement);
    });
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));

    // Create particle system
    this.createParticles();

    // Handle resize
    window.addEventListener('resize', this.onResizeBound, { passive: true });

    // Start animation loop
    this.animate();
  }

  private createParticles(): void {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // Cyan/Purple gradient colors
      const isCyan = Math.random() > 0.4;
      if (isCyan) {
        colors[i * 3] = 0.024;
        colors[i * 3 + 1] = 0.714;
        colors[i * 3 + 2] = 0.831;
      } else {
        colors[i * 3] = 0.486;
        colors[i * 3 + 1] = 0.227;
        colors[i * 3 + 2] = 0.929;
      }
      sizes[i] = Math.random() * 3 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    // Add connection lines (subset)
    this.addConnectionLines();
  }

  private addConnectionLines(): void {
    const lineGeo = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    const numLines = 60;

    for (let i = 0; i < numLines; i++) {
      const x1 = (Math.random() - 0.5) * 16;
      const y1 = (Math.random() - 0.5) * 16;
      const z1 = (Math.random() - 0.5) * 5;
      const x2 = x1 + (Math.random() - 0.5) * 4;
      const y2 = y1 + (Math.random() - 0.5) * 4;
      const z2 = z1 + (Math.random() - 0.5) * 2;
      linePositions.push(x1, y1, z1, x2, y2, z2);
    }

    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeo, lineMat);
    this.scene.add(lines);
  }

  private animate(): void {
    if (!this.visible) return;
    this.animFrameId = requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.0005;

    // Rotate particles slowly
    this.particles.rotation.x = time * 0.05 + this.mouse.y * 0.1;
    this.particles.rotation.y = time * 0.08 + this.mouse.x * 0.1;

    this.renderer.render(this.scene, this.camera);
  }

  private trackMouse(): void {
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
  }

  private onResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animateHeroEntrance(): void {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(this.headingRef.nativeElement, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    })
    .to(this.descRef.nativeElement, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    }, '-=0.6')
    .to(this.ctaRef.nativeElement, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    }, '-=0.5')
    .to(this.statsRef.nativeElement, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    }, '-=0.4');
  }

  scrollToSection(e: Event, href: string): void {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      this.scrollService.scrollTo(target as HTMLElement, { offset: -80, duration: 1.5 });
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrameId);
    this.observer?.disconnect();
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResizeBound);
    this.renderer?.dispose();
  }
}
