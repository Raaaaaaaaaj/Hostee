import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStore } from '../../core/store/dashboard.store';
import { RoomsStore } from '../../core/store/rooms.store';
import { ReservationsStore } from '../../core/store/reservations.store';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    StatusBadgeComponent,
    ChartModule
  ],
  template: `
    <div class="flex flex-col gap-8 font-sans">
      
      <!-- Premium Title Banner Area -->
      <div class="flex justify-between items-center bg-slate-900 text-white p-8 rounded-[28px] shadow-lg relative overflow-hidden">
        <!-- Background accents -->
        <div class="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div class="absolute left-1/3 top-0 w-24 h-24 rounded-full bg-amber-500/10 blur-2xl"></div>

        <div class="z-10">
          <span class="text-xs uppercase font-extrabold tracking-widest text-indigo-400">OPERATIONAL INTEL</span>
          <h1 class="text-3xl font-black mt-1 tracking-tight">Grand Luxe Command Dashboard</h1>
          <p class="text-slate-400 text-xs mt-1.5 font-medium">Real-time status overview, booking pipelines, and financial yield forecasts.</p>
        </div>
        
        <div class="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md z-10">
          <div class="text-right">
            <span class="text-[9px] uppercase font-bold text-slate-400">Local Standard Time</span>
            <p class="text-sm font-extrabold">21:20 PM GMT+5:30</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <i class="pi pi-clock text-amber-400"></i>
          </div>
        </div>
      </div>

      <!-- KPI Stat Cards Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-stat-card 
          title="Occupancy Yield" 
          [value]="dashboardStore.metrics().occupancyRate + '%'" 
          description="Average bed density today"
          icon="pi pi-percentage" 
          trend="up" 
          trendValue="+2.4%" 
          theme="indigo"
        />
        <app-stat-card 
          title="Average Daily Rate (ADR)" 
          [value]="dashboardStore.adrFormatted()" 
          description="Average billing rate per room"
          icon="pi pi-money-bill" 
          trend="up" 
          trendValue="+$8.50" 
          theme="amber"
        />
        <app-stat-card 
          title="RevPAR Summary" 
          [value]="dashboardStore.revParFormatted()" 
          description="Revenue per available room"
          icon="pi pi-sliders-v" 
          trend="neutral" 
          trendValue="0%" 
          theme="gold"
        />
        <app-stat-card 
          title="Daily Gross Revenue" 
          [value]="dashboardStore.revenueFormatted()" 
          description="Room tariffs + auxiliary services"
          icon="pi pi-chart-line" 
          trend="up" 
          trendValue="+12.8%" 
          theme="teal"
        />
      </div>

      <!-- Charts & Visual Live Operations Split Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left: Visual Live Room Status Board -->
        <div class="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="text-base font-extrabold text-slate-800 tracking-tight">Live Room Status Grid</h3>
                <p class="text-[11px] text-slate-400 font-medium">Click on room cards to quick-edit housekeeping or room status inline</p>
              </div>
              <button 
                (click)="toggleFilter()"
                class="px-3 py-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-xs font-bold text-slate-500 rounded-xl flex items-center gap-1.5 transition-colors">
                <i class="pi pi-filter"></i>
                {{ filterMode() === 'all' ? 'All Rooms' : 'Occupied Only' }}
              </button>
            </div>

            <!-- Rooms Grid Layout -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              @for (room of visibleRooms(); track room.id) {
                <div 
                  (click)="openQuickEdit(room)"
                  class="p-4 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-premium rounded-2xl cursor-pointer transition-all duration-200 group flex flex-col justify-between h-32 relative">
                  
                  <div class="flex justify-between items-start">
                    <span class="text-sm font-extrabold text-slate-700 font-sans group-hover:text-indigo-600 transition-colors">
                      Room {{ room.number }}
                    </span>
                    <span class="text-[9px] uppercase font-bold text-slate-400 font-sans tracking-wide">
                      {{ room.type.split(' ')[0] }}
                    </span>
                  </div>

                  <div class="mt-3 flex flex-col gap-1.5">
                    <!-- Inline BADGES -->
                    <app-status-badge [status]="room.status" type="room" />
                    <app-status-badge [status]="room.housekeeping" type="housekeeping" />
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Quick Edit Panel (Inline Editing Instead of heavy popups!) -->
          @if (activeQuickEditRoom(); as room) {
            <div class="mt-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-col gap-3 relative animate-float" style="animation-duration: 6s;">
              <button 
                (click)="activeQuickEditRoom.set(null)"
                class="absolute top-3 right-3 text-slate-400 hover:text-slate-600" 
                title="Dismiss">
                <i class="pi pi-times text-xs"></i>
              </button>
              
              <div>
                <span class="text-[9px] uppercase font-bold text-indigo-500 tracking-wider">Quick Adjust Room status</span>
                <h4 class="text-sm font-extrabold text-slate-800 mt-0.5">Room {{ room.number }} ({{ room.type }})</h4>
              </div>

              <div class="flex flex-wrap items-center gap-4">
                <!-- Status Edit Buttons -->
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-slate-400 font-bold uppercase mr-1">Status:</span>
                  <button 
                    (click)="changeRoomStatus(room.id, 'vacant')" 
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all"
                    [ngClass]="room.status === 'vacant' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'">
                    Vacant
                  </button>
                  <button 
                    (click)="changeRoomStatus(room.id, 'occupied')" 
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all"
                    [ngClass]="room.status === 'occupied' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'">
                    Occupied
                  </button>
                  <button 
                    (click)="changeRoomStatus(room.id, 'dirty')" 
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all"
                    [ngClass]="room.status === 'dirty' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'">
                    Dirty
                  </button>
                  <button 
                    (click)="changeRoomStatus(room.id, 'maintenance')" 
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all"
                    [ngClass]="room.status === 'maintenance' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'">
                    Maint
                  </button>
                </div>

                <!-- Housekeeping Edit Buttons -->
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-slate-400 font-bold uppercase mr-1">Cleanliness:</span>
                  <button 
                    (click)="changeHousekeepingStatus(room.id, 'clean')" 
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all"
                    [ngClass]="room.housekeeping === 'clean' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'">
                    Clean
                  </button>
                  <button 
                    (click)="changeHousekeepingStatus(room.id, 'dirty')" 
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all"
                    [ngClass]="room.housekeeping === 'dirty' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'">
                    Dirty
                  </button>
                  <button 
                    (click)="changeHousekeepingStatus(room.id, 'inspected')" 
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all"
                    [ngClass]="room.housekeeping === 'inspected' ? 'bg-teal-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'">
                    Inspected
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Right: Elegant Performance Chart Trends -->
        <div class="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 class="text-base font-extrabold text-slate-800 tracking-tight mb-2">Revenue & Occupancy Metrics</h3>
            <p class="text-[11px] text-slate-400 font-medium mb-6">Financial performance metrics compared over the last 5 calendar months</p>
            
            <div class="w-full h-64 flex items-center justify-center">
              <p-chart type="bar" [data]="chartData()" [options]="chartOptions()" styleClass="w-full h-full"></p-chart>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
            <div class="flex flex-col">
              <span class="text-[10px] text-slate-400 font-bold uppercase">Estimated Gross Target</span>
              <p class="text-sm font-extrabold text-slate-700">$55,000.00 / mo</p>
            </div>
            <span class="text-xs font-bold text-emerald-600 px-2 py-1 bg-emerald-50 rounded-full flex items-center gap-1">
              <i class="pi pi-arrow-up-right text-[10px]"></i>
              89.0% Achieved
            </span>
          </div>
        </div>

      </div>

      <!-- Live Stay Operations split lists -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Left Today's Check-ins -->
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-base font-extrabold text-slate-800 tracking-tight">Check-ins Pending Today</h3>
              <p class="text-[11px] text-slate-400 font-medium">Stays arriving for verification and key dispatch</p>
            </div>
            <span class="text-xs px-2.5 py-1 bg-violet-50 text-violet-600 font-bold rounded-full">
              {{ checkInsToday().length }} Arriving
            </span>
          </div>

          <div class="flex flex-col gap-4">
            @for (res of checkInsToday(); track res.id) {
              <div class="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <i class="pi pi-user-plus text-sm"></i>
                  </div>
                  <div>
                    <h4 class="text-xs font-extrabold text-slate-700">{{ res.guestName }}</h4>
                    <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Room Type: {{ res.roomType }} • Status: {{ res.status }}</p>
                  </div>
                </div>
                <div class="text-right flex items-center gap-3">
                  <div>
                    <span class="text-[10px] text-slate-400 font-bold block">TOTAL FEE</span>
                    <span class="text-xs font-black text-slate-700">\${{ res.totalAmount }}</span>
                  </div>
                  <button 
                    (click)="processCheckIn(res.id)" 
                    class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold transition-all shadow-sm shadow-indigo-600/10">
                    Check In
                  </button>
                </div>
              </div>
            } @empty {
              <div class="py-12 text-center text-xs text-slate-400 font-medium">No check-ins arriving today</div>
            }
          </div>
        </div>

        <!-- Right Today's Check-outs -->
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-base font-extrabold text-slate-800 tracking-tight">Check-outs Pending Today</h3>
              <p class="text-[11px] text-slate-400 font-medium">Active stays checking out today. Process invoicing</p>
            </div>
            <span class="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 font-bold rounded-full">
              {{ checkOutsToday().length }} Outgoing
            </span>
          </div>

          <div class="flex flex-col gap-4">
            @for (res of checkOutsToday(); track res.id) {
              <div class="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <i class="pi pi-user-minus text-sm"></i>
                  </div>
                  <div>
                    <h4 class="text-xs font-extrabold text-slate-700">{{ res.guestName }}</h4>
                    <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Room number: {{ res.roomNumber }} • Duration: 4 Nights</p>
                  </div>
                </div>
                <div class="text-right flex items-center gap-3">
                  <div>
                    <span class="text-[10px] text-slate-400 font-bold block">PAID SUM</span>
                    <span class="text-xs font-black text-slate-700">\${{ res.paidAmount }}</span>
                  </div>
                  <button 
                    (click)="processCheckOut(res.id, res.roomId)" 
                    class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-bold transition-all shadow-sm shadow-amber-500/10">
                    Check Out
                  </button>
                </div>
              </div>
            } @empty {
              <div class="py-12 text-center text-xs text-slate-400 font-medium">No check-outs scheduled today</div>
            }
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashboardComponent {
  readonly dashboardStore = inject(DashboardStore);
  readonly roomsStore = inject(RoomsStore);
  readonly reservationsStore = inject(ReservationsStore);

  readonly filterMode = signal<'all' | 'occupied'>('all');
  readonly activeQuickEditRoom = signal<any | null>(null);

  readonly visibleRooms = computed(() => {
    if (this.filterMode() === 'occupied') {
      return this.roomsStore.rooms().filter(r => r.status === 'occupied');
    }
    return this.roomsStore.rooms().slice(0, 8); // Top 8 rooms on visual grid
  });

  readonly checkInsToday = computed(() => 
    this.reservationsStore.reservations().filter(res => res.status === 'confirmed')
  );

  readonly checkOutsToday = computed(() => 
    this.reservationsStore.reservations().filter(res => res.status === 'checked_in')
  );

  // Configuration for PrimeNG Chart (chart.js integration)
  readonly chartData = computed(() => {
    const trend = this.dashboardStore.revenueTrend();
    return {
      labels: trend.map(t => t.month),
      datasets: [
        {
          label: 'Revenue Tariff ($)',
          backgroundColor: '#4F46E5',
          borderColor: '#4F46E5',
          data: trend.map(t => t.revenue),
          borderRadius: 8
        },
        {
          label: 'Occupancy Rate (%)',
          backgroundColor: '#F59E0B',
          borderColor: '#F59E0B',
          data: trend.map(t => t.occupancy * 300), // Scaled to look beautiful alongside revenue
          borderRadius: 8
        }
      ]
    };
  });

  readonly chartOptions = signal({
    plugins: {
      legend: {
        labels: {
          color: '#475569',
          font: { family: 'Plus Jakarta Sans', weight: '600', size: 10 }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { family: 'Plus Jakarta Sans', size: 10 } }
      },
      y: {
        grid: { color: '#F1F5F9' },
        ticks: { color: '#64748B', font: { family: 'Plus Jakarta Sans', size: 10 } }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  });

  toggleFilter(): void {
    this.filterMode.update(m => m === 'all' ? 'occupied' : 'all');
  }

  openQuickEdit(room: any): void {
    this.activeQuickEditRoom.set(room);
  }

  changeRoomStatus(roomId: string, status: any): void {
    this.roomsStore.updateRoomStatus(roomId, status);
    
    // Update KPI counters
    const occupied = this.roomsStore.occupiedCount();
    const total = this.roomsStore.totalRoomsCount();
    const nextOcc = Math.round((occupied / total) * 1000) / 10;
    this.dashboardStore.updateMetrics({ 
      occupancyRate: nextOcc,
      availableRooms: this.roomsStore.vacantCount(),
      dirtyRooms: this.roomsStore.dirtyCount()
    });

    // Post notification
    this.dashboardStore.addNotification('info', `Room ${this.roomsStore.rooms().find(r => r.id === roomId)?.number} status adjusted to ${status}`);
    
    // Refresh quick edit
    const current = this.activeQuickEditRoom();
    if (current && current.id === roomId) {
      this.activeQuickEditRoom.set({ ...current, status });
    }
  }

  changeHousekeepingStatus(roomId: string, housekeeping: any): void {
    this.roomsStore.updateRoomHousekeeping(roomId, housekeeping);
    
    // Update KPI counters
    this.dashboardStore.updateMetrics({ 
      dirtyRooms: this.roomsStore.dirtyCount()
    });

    // Post notification
    this.dashboardStore.addNotification('success', `Room ${this.roomsStore.rooms().find(r => r.id === roomId)?.number} cleanliness adjusted to ${housekeeping}`);

    // Refresh quick edit
    const current = this.activeQuickEditRoom();
    if (current && current.id === roomId) {
      this.activeQuickEditRoom.set({ ...current, housekeeping });
    }
  }

  processCheckIn(resId: string): void {
    const res = this.reservationsStore.reservations().find(r => r.id === resId);
    if (!res) return;

    // Transition reservation state to checked_in
    this.reservationsStore.updateReservationStatus(resId, 'checked_in');
    
    // Transition associated room to occupied
    if (res.roomId) {
      this.roomsStore.updateRoomStatus(res.roomId, 'occupied');
      // If room was clean/inspected, leave housekeeping, else trigger clean check
    }

    // Refresh metrics
    const occupied = this.roomsStore.occupiedCount();
    const total = this.roomsStore.totalRoomsCount();
    const nextOcc = Math.round((occupied / total) * 1000) / 10;
    this.dashboardStore.updateMetrics({
      occupancyRate: nextOcc,
      checkInsToday: Math.max(0, this.dashboardStore.metrics().checkInsToday - 1),
      availableRooms: this.roomsStore.vacantCount()
    });

    // Notify toast and log notif
    this.dashboardStore.addNotification('success', `Verified guest ${res.guestName} checking in. Dispatched physical keys.`);
  }

  processCheckOut(resId: string, roomId?: string): void {
    const res = this.reservationsStore.reservations().find(r => r.id === resId);
    if (!res) return;

    // Transition reservation state to checked_out
    this.reservationsStore.updateReservationStatus(resId, 'checked_out');

    // Transition associated room to vacant and dirty
    if (roomId) {
      this.roomsStore.updateRoomStatus(roomId, 'vacant');
      this.roomsStore.updateRoomHousekeeping(roomId, 'dirty');
    }

    // Refresh metrics
    const occupied = this.roomsStore.occupiedCount();
    const total = this.roomsStore.totalRoomsCount();
    const nextOcc = Math.round((occupied / total) * 1000) / 10;
    this.dashboardStore.updateMetrics({
      occupancyRate: nextOcc,
      checkOutsToday: Math.max(0, this.dashboardStore.metrics().checkOutsToday - 1),
      availableRooms: this.roomsStore.vacantCount(),
      dirtyRooms: this.roomsStore.dirtyCount()
    });

    // Notify
    this.dashboardStore.addNotification('info', `Invoiced guest ${res.guestName}. Key card returned. Room ${res.roomNumber} set to Dirty.`);
  }
}
