import { Injectable, NgZone } from '@angular/core';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private lenis!: Lenis;
  private tick = (time: number) => this.lenis.raf(time * 1000);

  constructor(private zone: NgZone) {}

  init(): void {
    // Run the scroll loop outside Angular so every animation frame
    // doesn't trigger app-wide change detection (main cause of jank).
    this.zone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        lerp: 0.09,              // frame-rate independent, buttery interpolation
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        syncTouch: false,        // keep native momentum on touch devices (smoothest on mobile)
        infinite: false,
      });

      this.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(this.tick);
      gsap.ticker.lagSmoothing(0);
    });
  }

  getLenis(): Lenis { return this.lenis; }

  scrollTo(target: string | number | HTMLElement, options?: any): void {
    this.zone.runOutsideAngular(() => this.lenis?.scrollTo(target as any, options));
  }

  destroy(): void {
    gsap.ticker.remove(this.tick);
    this.lenis?.destroy();
  }
}
