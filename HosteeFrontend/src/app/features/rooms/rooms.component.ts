import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomsStore } from '../../core/store/rooms.store';
import { Room, RoomStatus, HousekeepingStatus } from '../../core/api/api.types';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { PremiumTableComponent } from '../../shared/components/premium-table.component';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatusBadgeComponent,
    PremiumTableComponent,
    InputTextModule,
    DrawerModule
  ],
  template: `
    <div class="flex flex-col gap-8 font-sans">
      
      <!-- Top Filters Banner -->
      <div class="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <!-- Search Input -->
        <div class="relative w-full md:max-w-xs">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            pInputText 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search room number or type..." 
            class="pl-10 w-full text-xs font-medium" 
          />
        </div>

        <!-- Filter Selects -->
        <div class="flex flex-wrap items-center gap-3">
          
          <!-- View Toggle -->
          <div class="bg-slate-100 border border-slate-200/50 rounded-xl p-1 flex items-center gap-1.5 shadow-inner">
            <button 
              (click)="viewMode.set('card')"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-xs"
              [ngClass]="viewMode() === 'card' ? 'bg-white text-slate-800 font-extrabold shadow-sm' : 'text-slate-400 hover:text-slate-600'">
              <i class="pi pi-th-large"></i>
            </button>
            <button 
              (click)="viewMode.set('table')"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-xs"
              [ngClass]="viewMode() === 'table' ? 'bg-white text-slate-800 font-extrabold shadow-sm' : 'text-slate-400 hover:text-slate-600'">
              <i class="pi pi-list"></i>
            </button>
          </div>

          <!-- Status Filter -->
          <select 
            [(ngModel)]="filterStatus"
            class="bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 outline-none focus:border-indigo-500">
            <option value="all">All Statuses</option>
            <option value="vacant">Vacant</option>
            <option value="occupied">Occupied</option>
            <option value="dirty">Dirty</option>
            <option value="reserved">Reserved</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <!-- Type Filter -->
          <select 
            [(ngModel)]="filterType"
            class="bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 outline-none focus:border-indigo-500">
            @for (type of roomsStore.roomTypes(); track type) {
              <option [value]="type">{{ type === 'all' ? 'All Suite Types' : type }}</option>
            }
          </select>

          <!-- New Room Trigger -->
          <button 
            (click)="openCreateDrawer()"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
            <i class="pi pi-plus"></i> Add Room
          </button>
        </div>

      </div>

      <!-- Main Visual View Container -->
      @if (viewMode() === 'card') {
        <!-- Card Grid View -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (room of roomsStore.filteredRooms(); track room.id) {
            <div 
              (click)="selectRoom(room)"
              class="p-6 bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-premium rounded-[26px] cursor-pointer transition-all duration-300 flex flex-col justify-between h-48 relative overflow-hidden group">
              
              <!-- Ambient background visual design -->
              <div class="absolute -right-12 -bottom-12 w-28 h-28 rounded-full bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div class="flex justify-between items-start">
                <div>
                  <span class="text-xs uppercase font-extrabold text-indigo-500 tracking-wider">
                    Room {{ room.number }}
                  </span>
                  <h3 class="text-sm font-black text-slate-800 tracking-tight mt-0.5 font-sans">
                    {{ room.type }}
                  </h3>
                </div>
                <div class="text-right">
                  <span class="text-xs font-extrabold text-slate-700 block">\${{ room.rate }}</span>
                  <span class="text-[9px] text-slate-400 font-semibold uppercase block tracking-wider">per night</span>
                </div>
              </div>

              <!-- Badges Column -->
              <div class="mt-4 flex flex-col gap-1.5 items-start">
                <app-status-badge [status]="room.status" type="room" />
                <app-status-badge [status]="room.housekeeping" type="housekeeping" />
              </div>

              <!-- Footer with subtle occupancy details -->
              <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-semibold font-sans">
                <span class="flex items-center gap-1">
                  <i class="pi pi-users text-[10px]"></i>
                  Cap: {{ room.maxOccupancy }} Guests
                </span>
                <span>Floor {{ room.floor }}</span>
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Expandable Table View -->
        <app-premium-table 
          title="Rooms Catalog" 
          subtitle="Detailed ledger of suites, housekeeping queues and night rates."
          [columns]="tableColumns"
          [data]="roomsStore.filteredRooms()"
          (rowClick)="selectRoom($event)">
          
          <!-- Column templates projection -->
          <div [ngTemplateOutlet]="statusColTpl" slot="status"></div>
        </app-premium-table>
      }

      <!-- Custom Angular 20 Templates for columns inside premium-table -->
      <ng-template #statusColTpl let-item>
        <app-status-badge [status]="item.status" type="room" />
      </ng-template>

      <!-- Side Inspector Detail Slide Drawer (Popup-free editing UI!) -->
      <p-drawer 
        [(visible)]="drawerVisible" 
        position="right" 
        [modal]="true"
        styleClass="w-full max-w-lg p-0 bg-white">
        
        @if (selectedRoom(); as room) {
          <div class="h-full flex flex-col justify-between font-sans">
            
            <!-- Drawer Header -->
            <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <span class="text-xs uppercase font-extrabold text-indigo-500 tracking-wider">Room Inspector</span>
                <h3 class="text-lg font-black text-slate-800 mt-0.5">Suite {{ room.number }} Overview</h3>
              </div>
              <button 
                (click)="drawerVisible.set(false)"
                class="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"
                title="Dismiss">
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>

            <!-- Drawer Content (Structured forms & amenities) -->
            <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              <!-- Quick adjust status row -->
              <div class="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                <span class="text-xs font-bold text-slate-600">Active Room State</span>
                <div class="flex items-center gap-1.5">
                  <app-status-badge [status]="room.status" type="room" />
                  <app-status-badge [status]="room.housekeeping" type="housekeeping" />
                </div>
              </div>

              <!-- Form Details inline editing -->
              <div class="flex flex-col gap-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">Suite Type</label>
                    <input pInputText type="text" [(ngModel)]="room.type" class="text-xs font-bold text-slate-700" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">Night Rate ($)</label>
                    <input pInputText type="number" [(ngModel)]="room.rate" class="text-xs font-bold text-slate-700" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">Max Capacity</label>
                    <input pInputText type="number" [(ngModel)]="room.maxOccupancy" class="text-xs font-bold text-slate-700" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">Floor Level</label>
                    <input pInputText type="number" [(ngModel)]="room.floor" class="text-xs font-bold text-slate-700" />
                  </div>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-[10px] uppercase font-bold text-slate-400">Room Status</label>
                  <select 
                    [(ngModel)]="room.status"
                    class="bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 outline-none w-full">
                    <option value="vacant">Vacant</option>
                    <option value="occupied">Occupied</option>
                    <option value="dirty">Dirty</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-[10px] uppercase font-bold text-slate-400">Housekeeping Status</label>
                  <select 
                    [(ngModel)]="room.housekeeping"
                    class="bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 outline-none w-full">
                    <option value="clean">Clean</option>
                    <option value="dirty">Dirty</option>
                    <option value="inspected">Inspected</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <!-- Amenities tags -->
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block mb-2">Room Amenities</span>
                <div class="flex flex-wrap gap-1.5">
                  @for (amenity of room.amenities; track amenity) {
                    <span class="px-2.5 py-1 bg-indigo-50/50 border border-indigo-100/50 text-[10px] font-bold text-indigo-600 rounded-xl">
                      {{ amenity }}
                    </span>
                  }
                </div>
              </div>
            </div>

            <!-- Drawer Footer Action -->
            <div class="p-6 border-t border-slate-50 bg-slate-50/20 flex gap-3">
              <button 
                (click)="saveRoomChanges(room)"
                class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                Save Adjustments
              </button>
              <button 
                (click)="deleteRoom(room.id)"
                class="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all">
                Delete Room
              </button>
            </div>

          </div>
        }
      </p-drawer>

      <!-- Room Create Form Drawer Mock -->
      <p-drawer 
        [(visible)]="createDrawerVisible" 
        position="right" 
        [modal]="true"
        styleClass="w-full max-w-lg p-0 bg-white">
        
        <div class="h-full flex flex-col justify-between font-sans">
          <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div>
              <span class="text-xs uppercase font-extrabold text-indigo-500 tracking-wider">Inventory Entry</span>
              <h3 class="text-lg font-black text-slate-800 mt-0.5">Register New Suite</h3>
            </div>
            <button (click)="createDrawerVisible.set(false)" class="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400" title="Dismiss"><i class="pi pi-times text-xs"></i></button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="text-[10px] uppercase font-bold text-slate-400 font-sans">Room Number</label>
                <input pInputText type="text" [(ngModel)]="newRoom.number" placeholder="e.g. 302" class="text-xs font-bold" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[10px] uppercase font-bold text-slate-400 font-sans">Suite Type</label>
                <input pInputText type="text" [(ngModel)]="newRoom.type" placeholder="Deluxe, Superior..." class="text-xs font-bold" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="text-[10px] uppercase font-bold text-slate-400 font-sans">Night Tariff ($)</label>
                <input pInputText type="number" [(ngModel)]="newRoom.rate" placeholder="180" class="text-xs font-bold" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[10px] uppercase font-bold text-slate-400 font-sans">Max Occupancy</label>
                <input pInputText type="number" [(ngModel)]="newRoom.maxOccupancy" placeholder="2" class="text-xs font-bold" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="text-[10px] uppercase font-bold text-slate-400 font-sans">Floor Level</label>
                <input pInputText type="number" [(ngModel)]="newRoom.floor" placeholder="3" class="text-xs font-bold" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[10px] uppercase font-bold text-slate-400 font-sans">Amenities (comma-sep)</label>
                <input pInputText type="text" [(ngModel)]="amenitiesCsv" placeholder="WiFi, AC, Jacuzzi" class="text-xs font-bold" />
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-slate-50 bg-slate-50/20">
            <button 
              (click)="saveNewRoom()"
              class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
              Confirm Entry
            </button>
          </div>
        </div>

      </p-drawer>

    </div>
  `
})
export class RoomsComponent {
  readonly roomsStore = inject(RoomsStore);

  readonly viewMode = signal<'card' | 'table'>('card');
  readonly drawerVisible = signal(false);
  readonly createDrawerVisible = signal(false);
  readonly selectedRoom = signal<Room | null>(null);

  // Filters inputs mapped directly to roomsStore signals
  get searchQuery(): string { return this.roomsStore.searchQuery(); }
  set searchQuery(val: string) { this.roomsStore.searchQuery.set(val); }

  get filterStatus(): RoomStatus | 'all' { return this.roomsStore.filterStatus(); }
  set filterStatus(val: RoomStatus | 'all') { this.roomsStore.filterStatus.set(val); }

  get filterType(): string | 'all' { return this.roomsStore.filterType(); }
  set filterType(val: string | 'all') { this.roomsStore.filterType.set(val); }

  readonly tableColumns = [
    { field: 'number', header: 'Room No', width: '15%' },
    { field: 'type', header: 'Suite Category', width: '35%' },
    { field: 'rate', header: 'Night Rate ($)', width: '15%' },
    { field: 'floor', header: 'Floor Level', width: '15%' },
    { field: 'status', header: 'Operational Status', width: '20%' }
  ];

  // Room Create Form Bindings
  readonly newRoom = {
    number: '',
    type: 'Superior Room',
    status: 'vacant' as RoomStatus,
    housekeeping: 'clean' as HousekeepingStatus,
    occupancy: 0,
    maxOccupancy: 2,
    rate: 180,
    floor: 1,
    amenities: [] as string[]
  };
  amenitiesCsv = '';

  selectRoom(room: Room): void {
    this.selectedRoom.set({ ...room });
    this.drawerVisible.set(true);
  }

  saveRoomChanges(editedRoom: Room): void {
    this.roomsStore.updateRoom(editedRoom.id, editedRoom);
    this.drawerVisible.set(false);
  }

  deleteRoom(id: string): void {
    this.roomsStore.deleteRoom(id);
    this.drawerVisible.set(false);
  }

  openCreateDrawer(): void {
    this.newRoom.number = '';
    this.newRoom.rate = 180;
    this.newRoom.maxOccupancy = 2;
    this.newRoom.floor = 1;
    this.amenitiesCsv = '';
    this.createDrawerVisible.set(true);
  }

  saveNewRoom(): void {
    if (!this.newRoom.number) return;
    
    this.newRoom.amenities = this.amenitiesCsv
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.roomsStore.addRoom({ ...this.newRoom });
    this.createDrawerVisible.set(false);
  }
}
