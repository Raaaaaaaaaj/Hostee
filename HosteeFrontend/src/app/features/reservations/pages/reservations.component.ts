import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationsStore } from '../../../core/store/reservations.store';
import { RoomsStore } from '../../../core/store/rooms.store';
import { GuestsStore } from '../../../core/store/guests.store';
import { Reservation, ReservationStatus, Room } from '../../../core/api/api.types';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { PageHeader } from '../../../shared/components/pageheader.component';
import { ViewMode } from '../../../shared/components/pageheaderviewswitcher.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatusBadgeComponent,
    DrawerModule,
    InputTextModule,
    PageHeader
  ],
  template: `
    <div class="flex flex-col gap-8 font-sans">
      
      <!-- Top Filters Banner -->
      <div class="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <!-- Page Header -->
          <app-page-header
            [viewMode]="viewMode()"
            (viewModeChange)="viewMode.set($event)"
          >
          </app-page-header>
        <!-- Page Header ends -->
        
        <!-- Right: Actions & Toggles -->
        <div class="flex flex-wrap items-center gap-3">
          
          <!-- Kanban / List View Toggle -->
          

          <!-- Add Booking CTA Stepper Drawer -->
          <button 
            (click)="openStepperDrawer()"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
            <i class="pi pi-calendar-plus"></i> New Booking
          </button>
        </div>

      </div>

      <!-- Board View -->
      @if (viewMode() === 'kanban') {
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-start overflow-x-auto pb-4">
          @for (column of kanbanColumns(); track column.status) {
            <div class="bg-slate-50 border border-slate-100 rounded-3xl p-4 min-w-[240px] flex flex-col gap-4">
              <!-- Column Header -->
              <div class="flex items-center justify-between px-2">
                <span class="text-xs uppercase font-extrabold text-slate-500 tracking-wider">
                  {{ column.title }}
                </span>
                <span class="text-[10px] px-2 py-0.5 bg-slate-200/50 text-slate-600 font-bold rounded-full">
                  {{ column.items.length }}
                </span>
              </div>

              <!-- Column Cards -->
              <div class="flex flex-col gap-3 min-h-[300px]">
                @for (res of column.items; track res.id) {
                  <div 
                    (click)="selectBooking(res)"
                    class="p-4 bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-premium rounded-2xl cursor-pointer transition-all duration-200 group flex flex-col justify-between gap-3 relative">
                    
                    <div>
                      <span class="text-[9px] text-slate-400 font-bold block">ID: {{ res.id }}</span>
                      <h4 class="text-xs font-extrabold text-slate-700 font-sans group-hover:text-indigo-600 mt-0.5">
                        {{ res.guestName }}
                      </h4>
                      <span class="text-[10px] text-slate-400 font-semibold block mt-0.5">
                        {{ res.roomType }} @if (res.roomNumber) { • Room {{ res.roomNumber }} }
                      </span>
                    </div>

                    <div class="flex items-center justify-between border-t border-slate-50 pt-2 text-[10px] text-slate-400 font-bold">
                      <span class="flex items-center gap-1">
                        <i class="pi pi-calendar text-[9px]"></i>
                        {{ res.checkIn.split('-')[1] }}/{{ res.checkIn.split('-')[2] }}
                      </span>
                      <span class="text-slate-600 font-extrabold">\${{ res.totalAmount }}</span>
                    </div>
                  </div>
                } @empty {
                  <div class="py-12 border border-dashed border-slate-200 rounded-2xl text-center text-[10px] text-slate-400 font-medium">
                    No reservations
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- List View -->
        <div class="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto w-full">
            <table class="w-full border-collapse text-left">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100">
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">ID</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Guest</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Room Category</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Check In</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Check Out</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Fee</th>
                </tr>
              </thead>
              <tbody>
                @for (res of reservationsStore.filteredReservations(); track res.id) {
                  <tr 
                    (click)="selectBooking(res)"
                    class="border-b border-slate-50 hover:bg-slate-50/40 cursor-pointer transition-colors">
                    <td class="px-6 py-4 text-xs font-bold text-slate-400">{{ res.id }}</td>
                    <td class="px-6 py-4 text-xs font-bold text-slate-700">{{ res.guestName }}</td>
                    <td class="px-6 py-4 text-xs font-semibold text-slate-500">
                      {{ res.roomType }} @if (res.roomNumber) { (Room {{ res.roomNumber }}) }
                    </td>
                    <td class="px-6 py-4 text-xs font-semibold text-slate-500">{{ res.checkIn }}</td>
                    <td class="px-6 py-4 text-xs font-semibold text-slate-500">{{ res.checkOut }}</td>
                    <td class="px-6 py-4 text-xs">
                      <app-status-badge [status]="res.status" type="reservation" />
                    </td>
                    <td class="px-6 py-4 text-xs font-black text-slate-700 text-right">\${{ res.totalAmount }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Multi-Step Booking Drawer Stepper -->
      <p-drawer 
        [(visible)]="stepperVisible" 
        position="right" 
        [modal]="true"
        styleClass="w-full max-w-lg p-0 bg-white">
        
        <div class="h-full flex flex-col justify-between font-sans">
          
          <!-- Stepper Header -->
          <div class="p-6 border-b border-slate-50 bg-slate-50/50">
            <div class="flex justify-between items-center">
              <div>
                <span class="text-xs uppercase font-extrabold text-indigo-500 tracking-wider">RESERVATIONS DESK</span>
                <h3 class="text-lg font-black text-slate-800 mt-0.5">Luxury Booking Stepper</h3>
              </div>
              <button (click)="stepperVisible.set(false)" class="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400" title="Dismiss"><i class="pi pi-times text-xs"></i></button>
            </div>

            <!-- Steps Progress Bar indicators -->
            <div class="flex items-center gap-2 mt-6">
              @for (step of [1, 2, 3]; track step) {
                <div class="flex-1 flex items-center gap-1.5">
                  <div 
                    class="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-all duration-200"
                    [ngClass]="activeStep() >= step ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'">
                    {{ step }}
                  </div>
                  <span class="text-[10px] font-bold text-slate-400" [ngClass]="{'text-indigo-600': activeStep() === step}">
                    {{ step === 1 ? 'Guest' : step === 2 ? 'Room' : 'Payment' }}
                  </span>
                  @if (step < 3) {
                    <div class="flex-1 h-0.5 bg-slate-100" [ngClass]="{'bg-indigo-200': activeStep() > step}"></div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Stepper Body Content -->
          <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            <!-- STEP 1: Select Guest -->
            @if (activeStep() === 1) {
              <div class="flex flex-col gap-4">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wide block">Select CRM Guest Record</span>
                <div class="flex flex-col gap-3">
                  @for (gst of guestsStore.guests(); track gst.id) {
                    <div 
                      (click)="selectedGuestRecord.set(gst)"
                      class="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl cursor-pointer flex items-center justify-between transition-all"
                      [ngClass]="{'border-indigo-500 bg-indigo-50/20': selectedGuestRecord()?.id === gst.id}">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 text-xs font-bold">
                          {{ gst.name.charAt(0) }}
                        </div>
                        <div>
                          <h4 class="text-xs font-extrabold text-slate-700">{{ gst.name }}</h4>
                          <span class="text-[10px] text-slate-400 font-semibold block mt-0.5">{{ gst.email }} • Tier: {{ gst.loyaltyTier }}</span>
                        </div>
                      </div>
                      <i class="pi pi-check text-xs text-indigo-600 opacity-0" [ngClass]="{'opacity-100': selectedGuestRecord()?.id === gst.id}"></i>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- STEP 2: Choose Room -->
            @if (activeStep() === 2) {
              <div class="flex flex-col gap-4">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wide block">Select Vacant Suite</span>
                <div class="flex flex-col gap-3">
                  @for (rm of vacantRooms(); track rm.id) {
                    <div 
                      (click)="selectedRoomRecord.set(rm)"
                      class="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl cursor-pointer flex items-center justify-between transition-all"
                      [ngClass]="{'border-indigo-500 bg-indigo-50/20': selectedRoomRecord()?.id === rm.id}">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center text-xs font-bold">
                          {{ rm.number }}
                        </div>
                        <div>
                          <h4 class="text-xs font-extrabold text-slate-700">{{ rm.type }}</h4>
                          <span class="text-[10px] text-slate-400 font-semibold block mt-0.5">Rate: \${{ rm.rate }}/night • Capacity: {{ rm.maxOccupancy }} Guests</span>
                        </div>
                      </div>
                      <i class="pi pi-check text-xs text-indigo-600 opacity-0" [ngClass]="{'opacity-100': selectedRoomRecord()?.id === rm.id}"></i>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- STEP 3: Confirmation -->
            @if (activeStep() === 3) {
              <div class="flex flex-col gap-6">
                <!-- Stay summary -->
                <div class="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 flex flex-col gap-3">
                  <span class="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Stay & Tariff Breakdown</span>
                  
                  <div class="grid grid-cols-2 gap-4 border-b border-indigo-100/30 pb-3">
                    <div>
                      <span class="text-[9px] text-slate-400 font-bold block uppercase">CRM Primary Guest</span>
                      <span class="text-xs font-extrabold text-slate-700">{{ selectedGuestRecord()?.name }}</span>
                    </div>
                    <div>
                      <span class="text-[9px] text-slate-400 font-bold block uppercase">Assigned Suite</span>
                      <span class="text-xs font-extrabold text-slate-700">Room {{ selectedRoomRecord()?.number }} ({{ selectedRoomRecord()?.type }})</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 border-b border-indigo-100/30 pb-3">
                    <div class="flex flex-col gap-1">
                      <label class="text-[9px] text-slate-400 font-bold uppercase">Check In Date</label>
                      <input type="date" [(ngModel)]="bookingForm.checkIn" class="text-xs font-bold bg-white px-2.5 py-1.5 border border-slate-200 rounded-xl" />
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[9px] text-slate-400 font-bold uppercase">Check Out Date</label>
                      <input type="date" [(ngModel)]="bookingForm.checkOut" class="text-xs font-bold bg-white px-2.5 py-1.5 border border-slate-200 rounded-xl" />
                    </div>
                  </div>

                  <div class="flex justify-between items-center pt-2">
                    <span class="text-xs font-bold text-slate-600">Calculated Grand Total Fee</span>
                    <span class="text-lg font-black text-indigo-600">\${{ calculateTotalFee() }}</span>
                  </div>
                </div>

                <!-- Auxiliary notes -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] uppercase font-bold text-slate-400">Special Guest Requests</label>
                  <textarea [(ngModel)]="bookingForm.specialRequests" placeholder="Feather pillows, high floor..." class="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 h-24 outline-none focus:border-indigo-500"></textarea>
                </div>
              </div>
            }

          </div>

          <!-- Stepper Footer Navigation Controls -->
          <div class="p-6 border-t border-slate-50 bg-slate-50/20 flex gap-3">
            @if (activeStep() > 1) {
              <button 
                (click)="prevStep()"
                class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">
                Previous
              </button>
            }
            
            @if (activeStep() < 3) {
              <button 
                (click)="nextStep()"
                [disabled]="!canProceed()"
                class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                Proceed
              </button>
            } @else {
              <button 
                (click)="confirmBooking()"
                class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                Confirm Reservation
              </button>
            }
          </div>

        </div>

      </p-drawer>

    </div>
  `,
})
export class ReservationsComponent {
  readonly reservationsStore = inject(ReservationsStore);
  readonly roomsStore = inject(RoomsStore);
  readonly guestsStore = inject(GuestsStore);

  readonly viewMode = signal<ViewMode>('kanban');
  readonly stepperVisible = signal(false);
  readonly activeStep = signal(1);

  // Stepper Selection Records
  readonly selectedGuestRecord = signal<any | null>(null);
  readonly selectedRoomRecord = signal<Room | null>(null);

  // Dynamic Vacant Rooms list for Stepper selection
  readonly vacantRooms = computed(() => 
    this.roomsStore.rooms().filter(r => r.status === 'vacant')
  );

  // Filters inputs mapped directly to reservationsStore signals
  get searchQuery(): string { return this.reservationsStore.searchQuery(); }
  set searchQuery(val: string) { this.reservationsStore.searchQuery.set(val); }

  readonly bookingForm = {
    checkIn: '2026-05-29',
    checkOut: '2026-06-02',
    specialRequests: '',
    guestsCount: 2
  };

  // Grouped Kanban Columns
  readonly kanbanColumns = computed(() => {
    const list = this.reservationsStore.filteredReservations();
    return [
      { title: 'Inquiry Lead', status: 'inquiry', items: list.filter(r => r.status === 'inquiry') },
      { title: 'Confirmed Stays', status: 'confirmed', items: list.filter(r => r.status === 'confirmed') },
      { title: 'Checked In', status: 'checked_in', items: list.filter(r => r.status === 'checked_in') },
      { title: 'Checked Out', status: 'checked_out', items: list.filter(r => r.status === 'checked_out') },
      { title: 'Cancelled', status: 'cancelled', items: list.filter(r => r.status === 'cancelled') }
    ];
  });

  openStepperDrawer(): void {
    this.selectedGuestRecord.set(null);
    this.selectedRoomRecord.set(null);
    this.activeStep.set(1);
    this.bookingForm.checkIn = '2026-05-29';
    this.bookingForm.checkOut = '2026-06-02';
    this.bookingForm.specialRequests = '';
    this.stepperVisible.set(true);
  }

  canProceed(): boolean {
    if (this.activeStep() === 1) return this.selectedGuestRecord() !== null;
    if (this.activeStep() === 2) return this.selectedRoomRecord() !== null;
    return true;
  }

  nextStep(): void {
    if (this.canProceed()) {
      this.activeStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    this.activeStep.update(s => Math.max(1, s - 1));
  }

  calculateTotalFee(): number {
    const rm = this.selectedRoomRecord();
    if (!rm) return 0;

    // Calculate nights count
    const inDate = new Date(this.bookingForm.checkIn);
    const outDate = new Date(this.bookingForm.checkOut);
    const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
    return rm.rate * nights;
  }

  confirmBooking(): void {
    const guest = this.selectedGuestRecord();
    const room = this.selectedRoomRecord();
    if (!guest || !room) return;

    const totalAmount = this.calculateTotalFee();

    this.reservationsStore.addReservation({
      guestId: guest.id,
      guestName: guest.name,
      roomId: room.id,
      roomNumber: room.number,
      roomType: room.type,
      checkIn: this.bookingForm.checkIn,
      checkOut: this.bookingForm.checkOut,
      status: 'confirmed',
      guestsCount: this.bookingForm.guestsCount,
      totalAmount,
      paidAmount: 0,
      paymentStatus: 'unpaid',
      specialRequests: this.bookingForm.specialRequests
    });

    // Update Room Status to reserved
    this.roomsStore.updateRoomStatus(room.id, 'reserved');

    // Notify
    inject(ReservationsStore); // reference check
    this.stepperVisible.set(false);
  }

  selectBooking(res: Reservation): void {
    // Allows easy inspection or trigger status update (e.g. Cancel booking)
    if (confirm(`Adjust reservation status for ${res.guestName}?`)) {
      const nextStatus = prompt(`Enter new status (inquiry, confirmed, checked_in, checked_out, cancelled):`, res.status);
      if (nextStatus) {
        this.reservationsStore.updateReservationStatus(res.id, nextStatus as ReservationStatus);
      }
    }
  }
}
