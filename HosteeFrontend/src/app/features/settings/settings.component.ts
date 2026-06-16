import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule
  ],
  template: `
    <div class="flex flex-col gap-8 font-sans">
      
      <!-- Split Settings Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Tab Selector List (Inline edit tabs!) -->
        <div class="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-1.5">
          <span class="text-[10px] uppercase font-bold text-slate-400 px-3 pb-2 block">Property Settings</span>
          @for (tab of settingsTabs(); track tab.id) {
            <button 
              (click)="activeTab.set(tab.id)"
              class="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold font-sans transition-all flex items-center gap-3"
              [ngClass]="activeTab() === tab.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'">
              <i [class]="tab.icon"></i>
              {{ tab.label }}
            </button>
          }
        </div>

        <!-- Right Content Panels based on Active Tab -->
        <div class="lg:col-span-9 bg-white p-8 rounded-[28px] border border-slate-100 shadow-sm min-h-[500px] flex flex-col justify-between">
          
          <!-- Render active panels via Control Flow -->
          @switch (activeTab()) {
            
            @case ('general') {
              <div class="flex flex-col gap-6">
                <div>
                  <h3 class="text-base font-extrabold text-slate-800 tracking-tight">General configurations</h3>
                  <p class="text-[11px] text-slate-400 font-medium">Standard property details, checkin schedules and system timezone</p>
                </div>

                <div class="flex flex-col gap-4 max-w-xl">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] uppercase font-bold text-slate-400">Property Trade Name</label>
                      <input pInputText type="text" [(ngModel)]="propertyForm.name" class="text-xs font-bold text-slate-700" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] uppercase font-bold text-slate-400">Timezone Standard</label>
                      <input pInputText type="text" [(ngModel)]="propertyForm.timezone" class="text-xs font-bold text-slate-700" />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] uppercase font-bold text-slate-400">Standard Check-In Time</label>
                      <input pInputText type="text" [(ngModel)]="propertyForm.checkIn" class="text-xs font-bold text-slate-700" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] uppercase font-bold text-slate-400">Standard Check-Out Time</label>
                      <input pInputText type="text" [(ngModel)]="propertyForm.checkOut" class="text-xs font-bold text-slate-700" />
                    </div>
                  </div>
                </div>
              </div>
            }

            @case ('integrations') {
              <div class="flex flex-col gap-6">
                <div>
                  <h3 class="text-base font-extrabold text-slate-800 tracking-tight">Active API Integrations</h3>
                  <p class="text-[11px] text-slate-400 font-medium">Configure connected cloud platforms and gateway tokens</p>
                </div>

                <div class="flex flex-col gap-4">
                  <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <i class="pi pi-credit-card text-base"></i>
                      </div>
                      <div>
                        <h4 class="text-xs font-extrabold text-slate-700">Stripe Payment Gateway</h4>
                        <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Automate check-out invoicing and credit cards vault security.</p>
                      </div>
                    </div>
                    <span class="text-[10px] px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-full">Connected</span>
                  </div>

                  <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <i class="pi pi-home text-base"></i>
                      </div>
                      <div>
                        <h4 class="text-xs font-extrabold text-slate-700">Airbnb Channel Manager</h4>
                        <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Sync inventories rates and inquiry logs dynamically every 2 mins.</p>
                      </div>
                    </div>
                    <span class="text-[10px] px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-full">Connected</span>
                  </div>

                  <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <i class="pi pi-sparkles text-base"></i>
                      </div>
                      <div>
                        <h4 class="text-xs font-extrabold text-slate-700">OpenAI Insights Engine</h4>
                        <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Powers Notion AI sidebars predicting weekend occupancy density.</p>
                      </div>
                    </div>
                    <span class="text-[10px] px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-full">Connected</span>
                  </div>
                </div>
              </div>
            }

            @case ('billing') {
              <div class="flex flex-col gap-6">
                <div>
                  <h3 class="text-base font-extrabold text-slate-800 tracking-tight">SaaS Subscription & Invoices</h3>
                  <p class="text-[11px] text-slate-400 font-medium">Verify your corporate subscription status and invoices</p>
                </div>

                <div class="bg-indigo-950 text-white p-6 rounded-2xl relative overflow-hidden">
                  <div class="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-indigo-500/20 blur-2xl"></div>
                  <span class="text-[9px] uppercase font-bold text-indigo-300 tracking-wider">ACTIVE SYSTEM LICENSE</span>
                  <h4 class="text-lg font-black mt-0.5">Grand Luxe Corporate Portfolio</h4>
                  <p class="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed max-w-sm">License tier supporting up to 5 properties and unlimited housekeeping tasks logs.</p>
                  
                  <div class="flex justify-between items-center border-t border-slate-900/60 pt-4 mt-4 text-xs font-bold">
                    <span>Renewal Date: Jan 15, 2027</span>
                    <span class="text-amber-400 font-black">$450.00 / mo</span>
                  </div>
                </div>
              </div>
            }

            @case ('roles') {
              <div class="flex flex-col gap-6">
                <div>
                  <h3 class="text-base font-extrabold text-slate-800 tracking-tight">Staff Roles & Authorization</h3>
                  <p class="text-[11px] text-slate-400 font-medium">Define fine-grained operational permissions across suites</p>
                </div>

                <div class="flex flex-col gap-3">
                  <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 class="text-xs font-extrabold text-slate-700">Administrator</h4>
                      <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Complete global clearance. Full edit control on financial ledgers.</p>
                    </div>
                    <span class="text-[10px] font-bold text-slate-500">2 Active Accounts</span>
                  </div>
                  
                  <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 class="text-xs font-extrabold text-slate-700">Property Manager</h4>
                      <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Full check-in, checkout, pricing adjustments and report export access.</p>
                    </div>
                    <span class="text-[10px] font-bold text-slate-500">1 Active Account</span>
                  </div>

                  <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 class="text-xs font-extrabold text-slate-700">Housekeeping Supervisor</h4>
                      <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Clean status override, crew schedules assignment and room alerts logging.</p>
                    </div>
                    <span class="text-[10px] font-bold text-slate-500">5 Active Accounts</span>
                  </div>
                </div>
              </div>
            }

          }

          <!-- Footer Save Trigger -->
          <div class="mt-8 pt-4 border-t border-slate-50 flex justify-end gap-3">
            <button 
              (click)="saveSettings()"
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
              Commit Configuration
            </button>
          </div>

        </div>

      </div>

    </div>
  `
})
export class SettingsComponent {
  readonly activeTab = signal('general');

  readonly settingsTabs = signal<Array<{ id: string; label: string; icon: string }>>([
    { id: 'general', label: 'General configs', icon: 'pi pi-info-circle' },
    { id: 'integrations', label: 'Active API Integrations', icon: 'pi pi-cloud' },
    { id: 'roles', label: 'Staff Roles & Authorization', icon: 'pi pi-users' },
    { id: 'billing', label: 'SaaS Subscription', icon: 'pi pi-credit-card' }
  ]);

  readonly propertyForm = {
    name: 'Grand Luxe Hotel & Spa Resorts',
    timezone: 'GMT+5:30 (Asia/Kolkata)',
    checkIn: '14:00 PM',
    checkOut: '11:00 AM'
  };

  saveSettings(): void {
    alert('Grand Luxe system configurations committed and pushed globally.');
  }
}
