import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [CommonModule, RouterLink],
  templateUrl: './button.html',
  host: {
    class: 'inline-block',
  },
})
export class Button {
  variant = input<ButtonVariant>('solid');
  size = input<ButtonSize>('md');
  disabled = input<boolean>(false);
  ariaLabel = input<string>('');
  fullWidth = input<boolean>(false);
  link = input<string>('');

  classes = computed(() => {
    const base = [
      'group relative inline-flex items-center justify-center font-bold rounded-full',
      'transition-all duration-200 ease-out active:scale-95',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/40 focus-visible:ring-offset-2',
      'disabled:opacity-40 disabled:pointer-events-none',
    ];

    const sizeMap: Record<ButtonSize, string> = {
      sm: 'px-5 py-2 text-(--text-xs) tracking-wide',
      md: 'px-8 md:px-10 py-3 md:py-3.5 text-(--text-xs) md:text-(--text-sm)',
      lg: 'px-10 md:px-14 py-4 md:py-5 text-(--text-sm) md:text-base',
    };

    const variantMap: Record<ButtonVariant, string> = {
      solid: [
        'bg-(--bg-surface) text-(--fg-base) shadow-md',
        'hover:bg-zinc-100 hover:shadow-lg',
      ].join(' '),
      outline: [
        'border border-(--fg-muted)/25 text-(--fg-base) bg-transparent',
        'hover:bg-(--bg-surface) hover:border-(--fg-base)/30',
      ].join(' '),
      ghost: [
        'text-(--brand-moss) border-b-2 border-transparent rounded-none pb-0.5',
        'hover:border-(--brand-moss)',
      ].join(' '),
    };

    return [
      ...base,
      sizeMap[this.size()],
      variantMap[this.variant()],
      this.fullWidth() ? 'w-full' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}
