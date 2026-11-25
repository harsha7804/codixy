import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// CSS 'transition: all' on an element fights GSAP tweens of the same
// properties (opacity/transform) and causes stutter. Disable CSS transitions
// for the duration of the reveal, then restore them.
const NO_CSS_TRANSITION = { transition: 'none' };
const restoreTransition = (targets: any) => () => gsap.set(targets, { clearProps: 'transition' });

@Injectable({ providedIn: 'root' })
export class AnimationService {

  revealSection(el: Element, options: any = {}): void {
    gsap.fromTo(el, { opacity: 0, y: 60, ...NO_CSS_TRANSITION }, { onComplete: restoreTransition(el),
      opacity: 1, y: 0, duration: options.duration || 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  }

  revealLeft(el: Element, options: any = {}): void {
    gsap.fromTo(el, { opacity: 0, x: -80, ...NO_CSS_TRANSITION }, { onComplete: restoreTransition(el),
      opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    });
  }

  revealRight(el: Element, options: any = {}): void {
    gsap.fromTo(el, { opacity: 0, x: 80, ...NO_CSS_TRANSITION }, { onComplete: restoreTransition(el),
      opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    });
  }

  revealScale(el: Element, options: any = {}): void {
    gsap.fromTo(el, { opacity: 0, scale: 0.85, ...NO_CSS_TRANSITION }, { onComplete: restoreTransition(el),
      opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  }

  animateCounter(el: HTMLElement, end: number, duration: number = 2, suffix: string = ''): void {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: end, duration, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.floor(obj.val) + suffix; },
    });
  }

  tiltEffect(el: HTMLElement): void {
    let rafId: number | null = null;
    el.addEventListener('mousemove', (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
        const rotateY = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        gsap.to(el, { rotateX, rotateY, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 });
        rafId = null;
      });
    });
    el.addEventListener('mouseleave', () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
    });
  }

  staggerReveal(containerEl: Element, childSelector: string, options: any = {}): void {
    const children = containerEl.querySelectorAll(childSelector);
    gsap.fromTo(children, { opacity: 0, y: 50, ...NO_CSS_TRANSITION }, { onComplete: restoreTransition(children),
      opacity: 1, y: 0, duration: options.duration || 0.8, stagger: options.stagger || 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: containerEl, start: 'top 80%', once: true },
    });
  }
}
