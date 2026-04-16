import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  theme = input<'light' | 'dark'>('light');
  lang = input<'ar' | 'en'>('ar');
  
  onToggleTheme = output<void>();
  onToggleLanguage = output<void>();

  toggleTheme() {
    this.onToggleTheme.emit();
  }

  toggleLanguage() {
    this.onToggleLanguage.emit();
  }
}
