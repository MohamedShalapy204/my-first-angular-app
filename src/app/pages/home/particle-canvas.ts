import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-particle-canvas',
  template: `<canvas #canvas class="fixed inset-0 w-full h-full pointer-events-none z-[-1] opacity-40"></canvas>`,
  standalone: true,
})
export class ParticleCanvas implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speed: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.2 + 0.05,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.z -= p.speed;
        if (p.z <= 0) {
          p.z = 1000;
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }
        const scale = 500 / (500 + p.z);
        const x2d = (p.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (p.y - canvas.height / 2) * scale + canvas.height / 2;
        const size2d = p.size * scale;
        ctx.fillStyle = `rgba(86, 100, 43, ${p.opacity * (1 - p.z / 1000)})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
}
