import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuestsStore } from '../../core/store/guests.store';
import { Guest } from '../../core/api/api.types';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DrawerModule,
    InputTextModule
  ],
  template: `
    <div class="flex flex-col gap-8 font-sans">
      
      <!-- Top Filters Banner -->
      <div class="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <!-- Search bar -->
        <div class="relative w-full md:max-w-xs">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            pInputText 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search CRM guest name or contact..." 
            class="pl-10 w-full text-xs font-medium" 
          />
        </div>

        <!-- Filter Selects -->
        <div class="flex flex-wrap items-center gap-3">
          
          <!-- Loyalty Tier Select -->
          <select 
            [(ngModel)]="filterTier"
            class="bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 outline-none focus:border-indigo-500">
            <option value="all">All Loyalty Tiers</option>
            <option value="none">Standard tier</option>
            <option value="silver">Silver Tier</option>
            <option value="gold">Gold Elite</option>
            <option value="platinum">Platinum Royal</option>
          </select>

          <!-- Register Guest CTA Drawer -->
          <button 
            (click)="openRegisterDrawer()"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
            <i class="pi pi-user-plus"></i> Register Guest
          </button>
        </div>

      </div>

      <!-- Guests Grid Catalog -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (guest of guestsStore.filteredGuests(); track guest.id) {
          <div 
            (click)="selectGuest(guest)"
            class="p-6 bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-premium rounded-[26px] cursor-pointer transition-all duration-300 flex flex-col justify-between h-56 relative overflow-hidden group">
            
            <div class="absolute -right-10 -bottom-10 w-24 h-24 rounded-full bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div>
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                  <div 
                    class="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold uppercase"
                    [ngClass]="tierClass(guest.loyaltyTier)">
                    {{ guest.name.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="text-sm font-black text-slate-800 tracking-tight font-sans">
                      {{ guest.name }}
                    </h3>
                    <span class="text-[9px] uppercase font-bold tracking-wider" [ngClass]="tierTextClass(guest.loyaltyTier)">
                      {{ guest.loyaltyTier }} Member
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs font-extrabold text-slate-700 block">{{ guest.stayCount }} Stays</span>
                  <span class="text-[9px] text-slate-400 font-semibold block uppercase">Stays Count</span>
                </div>
              </div>

              <!-- Preferences Tags inline preview -->
              <div class="mt-4 flex flex-wrap gap-1">
                @for (pref of guest.preferences.slice(0, 2); track pref) {
                  <span class="px-2 py-0.5 bg-slate-50 border border-slate-100/50 text-[9px] font-bold text-slate-500 rounded-lg">
                    {{ pref }}
                  </span>
                }
                @if (guest.preferences.length > 2) {
                  <span class="px-2 py-0.5 bg-slate-50 text-[9px] font-bold text-slate-400 rounded-lg">
                    +{{ guest.preferences.length - 2 }} more
                  </span>
                }
              </div>
            </div>

            <!-- Footer CRM metrics -->
            <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-semibold font-sans">
              <span>Total Spent: <strong class="text-slate-600 font-extrabold">\${{ guest.totalSpent.toLocaleString() }}</strong></span>
              <span>Last Stay: {{ guest.lastStay || 'None' }}</span>
            </div>
          </div>
        }
      </div>

      <!-- Guests CRM Inspector Side Drawer (Avoiding annoying alert modals!) -->
      <p-drawer 
        [(visible)]="drawerVisible" 
        position="right" 
        [modal]="true"
        styleClass="w-full max-w-lg p-0 bg-white">
        
        @if (selectedGuest(); as guest) {
          <div class="h-full flex flex-col justify-between font-sans">
            
            <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <span class="text-xs uppercase font-extrabold text-indigo-500 tracking-wider">CRM PROFILE DISPATCH</span>
                <h3 class="text-lg font-black text-slate-800 mt-0.5">{{ guest.name }}</h3>
              </div>
              <button 
                (click)="drawerVisible.set(false)"
                class="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"
                title="Dismiss">
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>

            <!-- Profile Details form inline editing -->
            <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              <!-- Contact details -->
              <div class="flex flex-col gap-4">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Personal Details</span>
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-[9px] text-slate-400 font-bold uppercase">Primary Name</label>
                    <input pInputText type="text" [(ngModel)]="guest.name" class="text-xs font-bold text-slate-700" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[9px] text-slate-400 font-bold uppercase">Loyalty Tier</label>
                    <select 
                      [(ngModel)]="guest.loyaltyTier"
                      class="bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 outline-none w-full">
                      <option value="none">Standard</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-[9px] text-slate-400 font-bold uppercase">Email Address</label>
                    <input pInputText type="email" [(ngModel)]="guest.email" class="text-xs font-bold text-slate-700" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[9px] text-slate-400 font-bold uppercase">Phone Number</label>
                    <input pInputText type="text" [(ngModel)]="guest.phone" class="text-xs font-bold text-slate-700" />
                  </div>
                </div>
              </div>

              <!-- Notes inline edit text -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] uppercase font-bold text-slate-400">Staff CRM internal notes</label>
                <textarea [(ngModel)]="guest.notes" class="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 h-24 outline-none focus:border-indigo-500"></textarea>
              </div>

              <!-- Stay history list preview -->
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block mb-2.5">Corporate Stay History</span>
                <div class="flex flex-col gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div class="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>Stay Frequency</span>
                    <span>{{ guest.stayCount }} Arrived Stays</span>
                  </div>
                  <div class="flex justify-between items-center text-xs font-bold text-slate-600 mt-2">
                    <span>Total Yield Revenue</span>
                    <span>\${{ guest.totalSpent.toLocaleString() }} Gross</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Action CTA buttons -->
            <div class="p-6 border-t border-slate-50 bg-slate-50/20 flex gap-3">
              <button 
                (click)="saveGuestChanges(guest)"
                class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                Save Profile Changes
              </button>
              <button 
                (click)="deleteGuest(guest.id)"
                class="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all">
                Deregister Profile
              </button>
            </div>

          </div>
        }
      </p-drawer>

      <!-- New Register Profile Drawer Mock -->
      <p-drawer 
        [(visible)]="registerDrawerVisible" 
        position="right" 
        [modal]="true"
        styleClass="w-full max-w-lg p-0 bg-white">
        
        <div class="h-full flex flex-col justify-between font-sans">
          
          <div class="p-6 border-b border-slate-50 bg-slate-50/50">
            <div class="flex justify-between items-center">
              <div>
                <span class="text-xs uppercase font-extrabold text-indigo-500 tracking-wider">CRM SYSTEM RECORD</span>
                <h3 class="text-lg font-black text-slate-800 mt-0.5">Register New Guest Profile</h3>
              </div>
              <button (click)="registerDrawerVisible.set(false)" class="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400" title="Dismiss"><i class="pi pi-times text-xs"></i></button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                <input pInputText type="text" [(ngModel)]="newGuest.name" placeholder="John Doe" class="text-xs font-bold" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[10px] uppercase font-bold text-slate-400">Loyalty Tier</label>
                <select 
                  [(ngModel)]="newGuest.loyaltyTier"
                  class="bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 outline-none w-full">
                  <option value="none">Standard</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="text-[10px] uppercase font-bold text-slate-400">Contact Email</label>
                <input pInputText type="email" [(ngModel)]="newGuest.email" placeholder="john@doe.com" class="text-xs font-bold" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[10px] uppercase font-bold text-slate-400">Mobile Phone</label>
                <input pInputText type="text" [(ngModel)]="newGuest.phone" placeholder="+1 (555) 019-2834" class="text-xs font-bold" />
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] uppercase font-bold text-slate-400 font-sans">CRM Profile internal notes</label>
              <textarea [(ngModel)]="newGuest.notes" placeholder="VIP notes, guest preferences..." class="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 h-24 outline-none focus:border-indigo-500"></textarea>
            </div>
          </div>

          <div class="p-6 border-t border-slate-50 bg-slate-50/20">
            <button 
              (click)="saveNewGuest()"
              class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
              Confirm CRM Registry
            </button>
          </div>

        </div>

      </p-drawer>

    </div>
  `
})
export class GuestsComponent {
  readonly guestsStore = inject(GuestsStore);

  readonly drawerVisible = signal(false);
  readonly registerDrawerVisible = signal(false);
  readonly selectedGuest = signal<Guest | null>(null);

  // Filters inputs mapped directly to guestsStore signals
  get searchQuery(): string { return this.guestsStore.searchQuery(); }
  set searchQuery(val: string) { this.guestsStore.searchQuery.set(val); }

  get filterTier(): 'all' | 'none' | 'silver' | 'gold' | 'platinum' { return this.guestsStore.filterTier(); }
  set filterTier(val: 'all' | 'none' | 'silver' | 'gold' | 'platinum') { this.guestsStore.filterTier.set(val); }

  // Guest Register Form bindings
  readonly newGuest = {
    name: '',
    email: '',
    phone: '',
    loyaltyTier: 'none' as 'none' | 'silver' | 'gold' | 'platinum',
    stayCount: 0,
    totalSpent: 0,
    preferences: [] as string[],
    notes: '',
    documents: [] as string[]
  };

  tierClass(tier: string): string {
    switch (tier) {
      case 'platinum': return 'bg-slate-900 text-amber-400 border border-slate-800';
      case 'gold': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'silver': return 'bg-slate-100 text-slate-600 border border-slate-200';
      default: return 'bg-indigo-50 text-indigo-500 border border-indigo-100';
    }
  }

  tierTextClass(tier: string): string {
    switch (tier) {
      case 'platinum': return 'text-amber-500';
      case 'gold': return 'text-amber-600';
      case 'silver': return 'text-slate-500';
      default: return 'text-indigo-400';
    }
  }

  selectGuest(guest: Guest): void {
    this.selectedGuest.set({ ...guest });
    this.drawerVisible.set(true);
  }

  saveGuestChanges(editedGuest: Guest): void {
    this.guestsStore.updateGuest(editedGuest.id, editedGuest);
    this.drawerVisible.set(false);
  }

  deleteGuest(id: string): void {
    this.guestsStore.deleteGuest(id);
    this.drawerVisible.set(false);
  }

  openRegisterDrawer(): void {
    this.newGuest.name = '';
    this.newGuest.email = '';
    this.newGuest.phone = '';
    this.newGuest.notes = '';
    this.newGuest.loyaltyTier = 'none';
    this.registerDrawerVisible.set(true);
  }

  saveNewGuest(): void {
    if (!this.newGuest.name) return;
    
    this.guestsStore.addGuest({ ...this.newGuest });
    this.registerDrawerVisible.set(false);
  }
}
