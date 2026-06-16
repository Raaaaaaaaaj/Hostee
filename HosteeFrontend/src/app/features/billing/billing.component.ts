import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { PremiumTableComponent } from '../../shared/components/premium-table.component';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    PremiumTableComponent
  ],
  template: `
    <div class="flex flex-col gap-8 font-sans">
      
      <!-- Top Billing Banner -->
      <div class="bg-white border border-slate-100 p-8 rounded-[28px] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span class="text-xs uppercase font-extrabold text-indigo-500 tracking-wider">Financial Overview</span>
          <h2 class="text-2xl font-black text-slate-800 tracking-tight mt-0.5">SaaS Billing & Invoices</h2>
          <p class="text-xs text-slate-400 font-medium mt-1">Review active subscriptions, manage payment gateways and audit past statements.</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            (click)="triggerPaymentMethod()"
            class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
            <i class="pi pi-credit-card"></i> Add Card
          </button>
        </div>
      </div>

      <!-- Financial Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <app-stat-card 
          title="Current Plan Tariff" 
          value="$450.00 / mo" 
          description="Enterprise License - Renewing June 15, 2026"
          icon="pi pi-verified" 
          trend="neutral" 
          trendValue="Active" 
          theme="indigo"
        />
        <app-stat-card 
          title="Total Spent (YTD)" 
          value="$2,250.00" 
          description="Consolidated corporate SaaS invoices"
          icon="pi pi-chart-line" 
          trend="up" 
          trendValue="+12.4%" 
          theme="teal"
        />
        <app-stat-card 
          title="Auxiliary Balance" 
          value="$0.00" 
          description="Pay-as-you-go API usage credits"
          icon="pi pi-money-bill" 
          trend="neutral" 
          trendValue="Reconciled" 
          theme="amber"
        />
      </div>

      <!-- Split Card Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Payment Wallet Card -->
        <div class="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
          <div>
            <h3 class="text-base font-extrabold text-slate-800 tracking-tight">Active Payment Methods</h3>
            <p class="text-[11px] text-slate-400 font-medium">Stripe-vaulted corporate payment details</p>
          </div>

          <!-- Glassmorphic credit card visual (Wow factor!) -->
          <div class="h-48 bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:scale-[1.01] transition-transform duration-300">
            <!-- Glass sheen -->
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
            
            <div class="flex justify-between items-start z-10">
              <span class="text-[9px] uppercase font-bold tracking-widest text-indigo-300">Corporate Elite</span>
              <i class="pi pi-credit-card text-xl text-indigo-400"></i>
            </div>

            <div class="z-10 mt-4">
              <span class="text-[10px] text-slate-400 tracking-wider">CARD NUMBER</span>
              <p class="text-lg font-mono tracking-widest font-bold mt-0.5">••••  ••••  ••••  8294</p>
            </div>

            <div class="flex justify-between items-center z-10 mt-4 border-t border-white/10 pt-3">
              <div>
                <span class="text-[8px] text-slate-400 block">CARDHOLDER</span>
                <span class="text-xs font-bold tracking-tight">Alexander Mercer</span>
              </div>
              <div class="text-right">
                <span class="text-[8px] text-slate-400 block">EXPIRY</span>
                <span class="text-xs font-bold tracking-tight">08 / 2029</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-600">
              <span class="flex items-center gap-2"><i class="pi pi-lock text-slate-400"></i> Vault Compliance</span>
              <span class="text-[10px] text-emerald-600 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded-md">PCI Level 1</span>
            </div>
          </div>
        </div>

        <!-- Right: Invoices Ledger Table -->
        <div class="lg:col-span-7">
          <app-premium-table 
            title="Consolidated Invoice Ledger" 
            subtitle="Past statements compiled for May 2026 cycle."
            [columns]="tableColumns"
            [data]="invoicesData()"
            (rowClick)="downloadInvoice($event)">
          </app-premium-table>
        </div>

      </div>

    </div>
  `
})
export class BillingComponent {
  readonly invoicesData = signal<Array<{ id: string; period: string; method: string; date: string; amount: number }>>([
    { id: 'INV-4920', period: 'May 15 - Jun 15, 2026', method: 'Visa ending 8294', date: '2026-05-15', amount: 450.00 },
    { id: 'INV-4802', period: 'Apr 15 - May 15, 2026', method: 'Visa ending 8294', date: '2026-04-15', amount: 450.00 },
    { id: 'INV-4691', period: 'Mar 15 - Apr 15, 2026', method: 'Visa ending 8294', date: '2026-03-15', amount: 450.00 },
    { id: 'INV-4573', period: 'Feb 15 - Mar 15, 2026', method: 'Visa ending 8294', date: '2026-02-15', amount: 450.00 },
    { id: 'INV-4411', period: 'Jan 15 - Feb 15, 2026', method: 'Visa ending 8294', date: '2026-01-15', amount: 450.00 }
  ]);

  readonly tableColumns = [
    { field: 'id', header: 'Invoice ID', width: '20%' },
    { field: 'period', header: 'Billing Period', width: '40%' },
    { field: 'date', header: 'Due Date', width: '20%' },
    { field: 'amount', header: 'Tariff ($)', width: '20%' }
  ];

  triggerPaymentMethod(): void {
    alert('Stripe Vault dialog initialized. Adding new corporate card details.');
  }

  downloadInvoice(item: any): void {
    alert(`Downloading invoice ${item.id} statement PDF.`);
  }
}
