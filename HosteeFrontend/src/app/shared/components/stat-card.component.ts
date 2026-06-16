import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden group">
      <!-- Glow effect on hover -->
      <div 
        class="absolute -right-16 -top-16 w-36 h-36 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
        [ngClass]="glowClass()">
      </div>

      <div class="flex items-center justify-between z-10">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
          {{ title() }}
        </span>
        <div 
          class="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          [ngClass]="iconBgClass()">
          <i [class]="icon() + ' text-sm'" [ngClass]="iconColorClass()"></i>
        </div>
      </div>

      <div class="mt-4 z-10">
        <h3 class="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
          {{ value() }}
        </h3>
        <p class="text-xs text-slate-500 mt-1 font-sans">
          {{ description() }}
        </p>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between z-10">
        <div class="flex items-center gap-1">
          <span 
            class="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5"
            [ngClass]="trendBgClass()">
            <i [class]="trendIcon()"></i>
            {{ trendValue() }}
          </span>
          <span class="text-[10px] text-slate-400 font-medium">vs last month</span>
        </div>
      </div>
    </div>
  `
})
export class StatCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly description = input<string>('');
  readonly icon = input.required<string>();
  readonly trend = input<'up' | 'down' | 'neutral'>('neutral');
  readonly trendValue = input<string>('0%');
  readonly theme = input<'indigo' | 'amber' | 'gold' | 'rose' | 'teal'>('indigo');

  readonly glowClass = computed(() => {
    switch (this.theme()) {
      case 'amber': return 'bg-amber-500';
      case 'gold': return 'bg-yellow-500';
      case 'rose': return 'bg-rose-500';
      case 'teal': return 'bg-teal-500';
      default: return 'bg-indigo-500';
    }
  });

  readonly iconBgClass = computed(() => {
    switch (this.theme()) {
      case 'amber': return 'bg-amber-50';
      case 'gold': return 'bg-yellow-50';
      case 'rose': return 'bg-rose-50';
      case 'teal': return 'bg-teal-50';
      default: return 'bg-indigo-50';
    }
  });

  readonly iconColorClass = computed(() => {
    switch (this.theme()) {
      case 'amber': return 'text-amber-600';
      case 'gold': return 'text-yellow-600';
      case 'rose': return 'text-rose-600';
      case 'teal': return 'text-teal-600';
      default: return 'text-indigo-600';
    }
  });

  readonly trendBgClass = computed(() => {
    if (this.trend() === 'up') return 'bg-emerald-50 text-emerald-600';
    if (this.trend() === 'down') return 'bg-rose-50 text-rose-600';
    return 'bg-slate-50 text-slate-600';
  });

  readonly trendIcon = computed(() => {
    if (this.trend() === 'up') return 'pi pi-arrow-up-right text-[10px]';
    if (this.trend() === 'down') return 'pi pi-arrow-down-left text-[10px]';
    return 'pi pi-minus text-[10px]';
  });
}
