import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardStore } from '../../core/store/dashboard.store';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatCardComponent,
    ButtonModule
  ],
  template: `
    <div class="flex flex-col gap-8 font-sans">
      
      <!-- Top Filters & Exports Action -->
      <div class="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div class="flex flex-wrap items-center gap-3">
          <!-- Calendar range filter -->
          <div class="flex flex-col gap-1">
            <span class="text-[9px] uppercase font-bold text-slate-400">Date Range</span>
            <select class="bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 outline-none">
              <option value="mtd">Month to Date (May 2026)</option>
              <option value="last30">Last 30 Days</option>
              <option value="lastQ">Last Quarter</option>
              <option value="ytd">Year to Date (2026)</option>
            </select>
          </div>

          <!-- Currency filter -->
          <div class="flex flex-col gap-1">
            <span class="text-[9px] uppercase font-bold text-slate-400">Operational Focus</span>
            <select class="bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 outline-none">
              <option value="all">Tariffs & Auxiliaries</option>
              <option value="rooms">Tariffs Only</option>
              <option value="spa">Spa & Wellness Only</option>
            </select>
          </div>
        </div>

        <!-- Export Actions dropdown -->
        <button 
          (click)="triggerExport()"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-end">
          <i class="pi pi-download"></i>
          Export Consolidated Audit
        </button>

      </div>

      <!-- Financial Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <app-stat-card 
          title="Consolidated Tariffs" 
          value="$38,550.00" 
          description="Net room rental yield MTD"
          icon="pi pi-building" 
          trend="up" 
          trendValue="+14.2%" 
          theme="indigo"
        />
        <app-stat-card 
          title="Consolidated Auxiliary" 
          value="$10,400.00" 
          description="Spa, shuttle and concierge services"
          icon="pi pi-sparkles" 
          trend="up" 
          trendValue="+8.9%" 
          theme="teal"
        />
        <app-stat-card 
          title="Net ADR Yield" 
          value="$285.50" 
          description="Average realized daily rate MTD"
          icon="pi pi-money-bill" 
          trend="up" 
          trendValue="+$12.40" 
          theme="amber"
        />
      </div>

      <!-- visual statistics charts split panel -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left: occupancy yields ledger -->
        <div class="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 class="text-base font-extrabold text-slate-800 tracking-tight mb-2">Realized Monthly Yield Ledger</h3>
          <p class="text-[11px] text-slate-400 font-medium mb-6">Historical auditing review compiled for May 2026</p>

          <div class="flex flex-col gap-4">
            @for (item of dashboardStore.revenueTrend(); track item.month) {
              <div class="p-4 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    {{ item.month }}
                  </div>
                  <div>
                    <h4 class="text-xs font-extrabold text-slate-700">Financial Cycle Summary</h4>
                    <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Average bed density: {{ item.occupancy }}%</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-slate-400 font-bold block">Tariffs Audit</span>
                  <span class="text-xs font-black text-slate-700">\${{ item.revenue.toLocaleString() }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Right: Auditing alerts -->
        <div class="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 class="text-base font-extrabold text-slate-800 tracking-tight mb-2">Audit Compliance Logs</h3>
          <p class="text-[11px] text-slate-400 font-medium mb-6">Real-time discrepancies and verified checkouts compliance alerts</p>

          <div class="flex flex-col gap-3">
            <div class="p-3 bg-emerald-50/40 border border-emerald-100/50 rounded-xl flex items-start gap-2.5">
              <i class="pi pi-check-circle text-emerald-500 mt-0.5 text-xs"></i>
              <div>
                <h4 class="text-xs font-extrabold text-slate-700">All checks reconciled</h4>
                <p class="text-[10px] text-slate-400 font-medium mt-0.5">All 24 active guest portfolios reconciled with Stripe balance sheet.</p>
              </div>
            </div>
            <div class="p-3 bg-indigo-50/40 border border-indigo-100/50 rounded-xl flex items-start gap-2.5">
              <i class="pi pi-info-circle text-indigo-500 mt-0.5 text-xs"></i>
              <div>
                <h4 class="text-xs font-extrabold text-slate-700">Housekeeping checklists signed</h4>
                <p class="text-[10px] text-slate-400 font-medium mt-0.5">Supervisor Marcus Brody signed housekeeping audit checklist for Floor 1.</p>
              </div>
            </div>
            <div class="p-3 bg-amber-50/40 border border-amber-100/50 rounded-xl flex items-start gap-2.5">
              <i class="pi pi-exclamation-triangle text-amber-500 mt-0.5 text-xs"></i>
              <div>
                <h4 class="text-xs font-extrabold text-slate-700">Auxiliary spa invoice review</h4>
                <p class="text-[10px] text-slate-400 font-medium mt-0.5">Room 101 auxiliary spa invoice ($120) requires secondary reception signature.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class ReportsComponent {
  readonly dashboardStore = inject(DashboardStore);

  triggerExport(): void {
    alert('Consolidated Audit Report compiled as PDF & exported to local PMS storage directory.');
  }
}
