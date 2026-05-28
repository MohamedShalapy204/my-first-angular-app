import { Component, ChangeDetectionStrategy, model, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../Services/settings';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  private readonly settingsService = inject(SettingsService);

  readonly theme = this.settingsService.theme;
  readonly lang = this.settingsService.lang;

  toggleTheme() {
    this.settingsService.toggleTheme();
  }

  toggleLanguage() {
    this.settingsService.toggleLang();
  }
}
