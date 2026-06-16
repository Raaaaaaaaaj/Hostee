import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide font-sans shadow-sm"
      [ngClass]="badgeClass()">
      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="dotClass()"></span>
      {{ label() }}
    </span>
  `
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();
  readonly type = input<'room' | 'reservation' | 'housekeeping'>('room');

  readonly label = computed(() => {
    const val = this.status().replace('_', ' ');
    return val.charAt(0).toUpperCase() + val.slice(1);
  });

  readonly badgeClass = computed(() => {
    const s = this.status().toLowerCase();
    
    if (this.type() === 'room') {
      switch (s) {
        case 'vacant': return 'bg-emerald-50 text-emerald-700 border border-emerald-100/50';
        case 'occupied': return 'bg-indigo-50 text-indigo-700 border border-indigo-100/50';
        case 'dirty': return 'bg-rose-50 text-rose-700 border border-rose-100/50';
        case 'reserved': return 'bg-amber-50 text-amber-700 border border-amber-100/50';
        case 'maintenance': return 'bg-slate-100 text-slate-700 border border-slate-200/50';
        default: return 'bg-slate-50 text-slate-600';
      }
    }

    if (this.type() === 'reservation') {
      switch (s) {
        case 'inquiry': return 'bg-sky-50 text-sky-700 border border-sky-100/50';
        case 'confirmed': return 'bg-violet-50 text-violet-700 border border-violet-100/50';
        case 'checked_in': return 'bg-emerald-50 text-emerald-700 border border-emerald-100/50';
        case 'checked_out': return 'bg-slate-100 text-slate-600 border border-slate-200/50';
        case 'cancelled': return 'bg-rose-50 text-rose-700 border border-rose-100/50';
        default: return 'bg-slate-50 text-slate-600';
      }
    }

    // Housekeeping status
    switch (s) {
      case 'clean': return 'bg-emerald-50 text-emerald-700 border border-emerald-100/50';
      case 'dirty': return 'bg-rose-50 text-rose-700 border border-rose-100/50';
      case 'inspected': return 'bg-teal-50 text-teal-700 border border-teal-100/50';
      case 'maintenance': return 'bg-amber-50 text-amber-700 border border-amber-100/50';
      default: return 'bg-slate-50 text-slate-600';
    }
  });

  readonly dotClass = computed(() => {
    const s = this.status().toLowerCase();

    if (this.type() === 'room') {
      switch (s) {
        case 'vacant': return 'bg-emerald-500 animate-pulse';
        case 'occupied': return 'bg-indigo-500';
        case 'dirty': return 'bg-rose-500 animate-bounce';
        case 'reserved': return 'bg-amber-500';
        case 'maintenance': return 'bg-slate-400';
        default: return 'bg-slate-400';
      }
    }

    if (this.type() === 'reservation') {
      switch (s) {
        case 'inquiry': return 'bg-sky-500';
        case 'confirmed': return 'bg-violet-500 animate-pulse';
        case 'checked_in': return 'bg-emerald-500';
        case 'checked_out': return 'bg-slate-400';
        case 'cancelled': return 'bg-rose-500';
        default: return 'bg-slate-400';
      }
    }

    // Housekeeping status
    switch (s) {
      case 'clean': return 'bg-emerald-500';
      case 'dirty': return 'bg-rose-500';
      case 'inspected': return 'bg-teal-500';
      case 'maintenance': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  });
}
