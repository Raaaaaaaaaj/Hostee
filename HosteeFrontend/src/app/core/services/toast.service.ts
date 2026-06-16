import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly messageService = inject(MessageService);

  showSuccess(summary: string, detail: string, life: number = 3000): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life,
      styleClass: 'rounded-2xl border-l-4 border-indigo-600 bg-white shadow-xl font-sans'
    });
  }

  showError(summary: string, detail: string, life: number = 5000): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life,
      styleClass: 'rounded-2xl border-l-4 border-rose-500 bg-white shadow-xl font-sans'
    });
  }

  showWarning(summary: string, detail: string, life: number = 4000): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life,
      styleClass: 'rounded-2xl border-l-4 border-amber-500 bg-white shadow-xl font-sans'
    });
  }

  showInfo(summary: string, detail: string, life: number = 3000): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life,
      styleClass: 'rounded-2xl border-l-4 border-sky-500 bg-white shadow-xl font-sans'
    });
  }

  clear(): void {
    this.messageService.clear();
  }
}
