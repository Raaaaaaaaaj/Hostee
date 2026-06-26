import { Component, inject} from '@angular/core';
import { Theme } from '../../../../core/services/theme.service';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-toggle-theme-button',
  imports: [ButtonModule],
  template: 
  `
    <p-button
      [icon] = "themeService.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'"
      [text] = "true"
      [rounded] = "true"
      (onClick)="themeService.toggleTheme()"
      severity="secondary"
      styleClass="p-0 transition-transform duration-300 active:scale-95"
      aria-label="Toggle Theme"
    >
    </p-button>
  `,
  styles: `

  `,
})
export class ToggleThemeButton {
  protected themeService = inject(Theme)
} 
