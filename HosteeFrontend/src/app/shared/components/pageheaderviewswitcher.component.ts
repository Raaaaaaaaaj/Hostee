import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ViewMode = 'kanban' | 'list' | 'calender' | 'card';

@Component({
  selector: 'app-page-header-view-switcher',
  imports: [CommonModule],
  template: `
    <div class="bg-slate-100 border border-slate-200/50 rounded-xl p-1 flex items-center gap-1.5 shadow-inner">
            <button 
              (click)="viewModeChange.emit('kanban')"
              class="px-3 py-1.5 rounded-lg flex items-center justify-center transition-all text-xs font-bold gap-1"
              [ngClass]="viewMode() === 'kanban' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'">
              <i class="pi pi-sliders-v"></i> Board
            </button>
            <button 
              (click)="viewModeChange.emit('list')"
              class="px-3 py-1.5 rounded-lg flex items-center justify-center transition-all text-xs font-bold gap-1"
              [ngClass]="viewMode() === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'">
              <i class="pi pi-list"></i> List
            </button>
            <button 
              (click)="viewModeChange.emit('calender')"
              class="px-3 py-1.5 rounded-lg flex items-center justify-center transition-all text-xs font-bold gap-1"
              [ngClass]="viewMode() === 'calender' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'">
              <i class="pi pi-calendar"></i> Calendar
            </button>
          </div>
  `,
  styles: `

  `,
})
export class PageHeaderViewSwitcher {
  viewMode = input.required<ViewMode>();
  viewModeChange = output<ViewMode>()
}
