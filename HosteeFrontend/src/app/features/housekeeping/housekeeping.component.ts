import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HousekeepingStore } from '../../core/store/housekeeping.store';
import { HousekeepingTask, HousekeepingStatus } from '../../core/api/api.types';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-housekeeping',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
            placeholder="Search room or cleaner..." 
            class="pl-10 w-full text-xs font-medium" 
          />
        </div>

        <!-- KPI task summaries -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="px-3.5 py-2 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-600 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            {{ housekeepingStore.dirtyTasksCount() }} Dirty Rooms
          </div>
          <div class="px-3.5 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-600 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {{ housekeepingStore.cleanTasksCount() }} Clean Rooms
          </div>
          <div class="px-3.5 py-2 bg-teal-50 border border-teal-100 rounded-2xl text-xs font-bold text-teal-600 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            {{ housekeepingStore.inspectedTasksCount() }} Inspected Ready
          </div>
        </div>

      </div>

      <!-- visual boards grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-start overflow-x-auto pb-4">
        @for (lane of housekeepingLanes(); track lane.status) {
          <div class="bg-slate-50 border border-slate-100 rounded-3xl p-4 min-w-[240px] flex flex-col gap-4">
            
            <!-- Column Header -->
            <div class="flex items-center justify-between px-2">
              <span class="text-xs uppercase font-extrabold text-slate-500 tracking-wider">
                {{ lane.title }}
              </span>
              <span class="text-[10px] px-2 py-0.5 bg-slate-200/50 text-slate-600 font-bold rounded-full">
                {{ lane.items.length }}
              </span>
            </div>

            <!-- Tasks list -->
            <div class="flex flex-col gap-3 min-h-[300px]">
              @for (task of lane.items; track task.id) {
                <div 
                  class="p-4 bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-premium rounded-2xl transition-all duration-200 flex flex-col justify-between gap-3 relative group">
                  
                  <div class="flex justify-between items-start">
                    <div>
                      <span class="text-[9px] uppercase font-bold text-indigo-500 tracking-wider font-sans">
                        Suite {{ task.roomNumber }}
                      </span>
                      <p class="text-xs text-slate-400 font-semibold leading-relaxed mt-1 font-sans">
                        {{ task.notes || 'Routine housekeeping task.' }}
                      </p>
                    </div>
                    
                    <!-- Priority color badge -->
                    <span 
                      class="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-md"
                      [ngClass]="priorityClass(task.priority)">
                      {{ task.priority }}
                    </span>
                  </div>

                  <!-- Cleaner selector dropdown (Avoiding heavy popup dialogs!) -->
                  <div class="border-t border-slate-50 pt-2 flex flex-col gap-1.5">
                    <span class="text-[9px] uppercase font-bold text-slate-400">Assigned Crew</span>
                    <select 
                      [ngModel]="task.assignedCleaner"
                      (ngModelChange)="assignCleaner(task.id, $event)"
                      class="bg-slate-50 border border-slate-100 text-[10px] font-bold px-2 py-1 rounded-lg text-slate-600 outline-none w-full">
                      <option value="">Unassigned</option>
                      @for (cleaner of housekeepingStore.availableCleaners(); track cleaner) {
                        <option [value]="cleaner">{{ cleaner }}</option>
                      }
                    </select>
                  </div>

                  <!-- Action controls -->
                  <div class="flex items-center justify-between text-[10px] border-t border-slate-50 pt-2 font-bold text-slate-400">
                    <span>Task: {{ task.id }}</span>
                    
                    <div class="flex items-center gap-1">
                      @if (task.status === 'dirty') {
                        <button 
                          (click)="changeTaskStatus(task.id, 'clean')" 
                          class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors"
                          title="Set to Clean">
                          Clean
                        </button>
                      } @else if (task.status === 'clean') {
                        <button 
                          (click)="changeTaskStatus(task.id, 'inspected')" 
                          class="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg transition-colors"
                          title="Approve inspection">
                          Inspect
                        </button>
                      }
                    </div>
                  </div>

                </div>
              } @empty {
                <div class="py-12 border border-dashed border-slate-200 rounded-2xl text-center text-[10px] text-slate-400 font-medium">
                  No rooms pending
                </div>
              }
            </div>

          </div>
        }
      </div>

    </div>
  `
})
export class HousekeepingComponent {
  readonly housekeepingStore = inject(HousekeepingStore);

  // Filters inputs mapped directly to housekeepingStore signals
  get searchQuery(): string { return this.housekeepingStore.searchQuery(); }
  set searchQuery(val: string) { this.housekeepingStore.searchQuery.set(val); }

  readonly housekeepingLanes = computed(() => {
    const list = this.housekeepingStore.filteredTasks();
    return [
      { title: 'Dirty Queue', status: 'dirty', items: list.filter(t => t.status === 'dirty') },
      { title: 'Clean Awaiting Inspection', status: 'clean', items: list.filter(t => t.status === 'clean') },
      { title: 'Inspected Ready', status: 'inspected', items: list.filter(t => t.status === 'inspected') },
      { title: 'Out of Order / Maint', status: 'maintenance', items: list.filter(t => t.status === 'maintenance') }
    ];
  });

  priorityClass(prio: string): string {
    switch (prio) {
      case 'high': return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border border-amber-100';
      default: return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  }

  assignCleaner(taskId: string, cleaner: string): void {
    this.housekeepingStore.assignCleaner(taskId, cleaner);
  }

  changeTaskStatus(taskId: string, status: HousekeepingStatus): void {
    this.housekeepingStore.updateTaskStatus(taskId, status);
  }
}
