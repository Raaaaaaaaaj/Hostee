import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationsStore } from '../../core/store/reservations.store';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-page-header-search-input',
  imports: [FormsModule, InputTextModule],
  template: `
        <div class="relative w-50">
          <i class="pi pi-search absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            pInputText 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search" 
            class="pl-10 w-full text-xs font-medium right-7" 
          />
        </div>
  `,
  styles: `

  `,
})
export class PageHeaderSearchInput {

  readonly reservationsStore = inject(ReservationsStore);

  // Filters inputs mapped directly to reservationsStore signals
  get searchQuery(): string { return this.reservationsStore.searchQuery(); }
  set searchQuery(val: string) { this.reservationsStore.searchQuery.set(val); }

}
