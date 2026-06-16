import { Injectable, signal, computed } from '@angular/core';
import { Reservation, ReservationStatus } from '../api/api.types';

@Injectable({
  providedIn: 'root'
})
export class ReservationsStore {
  readonly reservations = signal<Reservation[]>([
    { id: 'res-501', guestId: 'gst-201', guestName: 'Victoria Sterling', roomId: 'rm-101', roomNumber: '101', roomType: 'Deluxe Suite', checkIn: '2026-05-28', checkOut: '2026-06-02', status: 'checked_in', guestsCount: 2, totalAmount: 1250, paidAmount: 1250, paymentStatus: 'paid', specialRequests: 'High floor preference. Anniversary celebration.', createdDate: '2026-05-15' },
    { id: 'res-502', guestId: 'gst-202', guestName: 'James Van Der Bilt', roomId: 'rm-201', roomNumber: '201', roomType: 'Penthouse Presidential', checkIn: '2026-05-29', checkOut: '2026-06-05', status: 'confirmed', guestsCount: 4, totalAmount: 6650, paidAmount: 3000, paymentStatus: 'partial', specialRequests: 'Private airport shuttle service requested.', createdDate: '2026-05-10' },
    { id: 'res-503', guestId: 'gst-203', guestName: 'Emma Watson', roomId: 'rm-104', roomNumber: '104', roomType: 'Superior Room', checkIn: '2026-05-30', checkOut: '2026-06-01', status: 'confirmed', guestsCount: 1, totalAmount: 360, paidAmount: 0, paymentStatus: 'unpaid', specialRequests: 'Gluten-free breakfast options.', createdDate: '2026-05-22' },
    { id: 'res-504', guestId: 'gst-204', guestName: 'Arthur Dent', roomId: 'rm-204', roomNumber: '204', roomType: 'Executive Suite', checkIn: '2026-05-25', checkOut: '2026-05-29', status: 'checked_out', guestsCount: 2, totalAmount: 1600, paidAmount: 1600, paymentStatus: 'paid', specialRequests: 'Need extra towels and a teapot.', createdDate: '2026-05-01' },
    { id: 'res-505', guestId: 'gst-205', guestName: 'Elena Rostova', roomId: undefined, roomNumber: undefined, roomType: 'Deluxe Suite', checkIn: '2026-06-15', checkOut: '2026-06-20', status: 'inquiry', guestsCount: 2, totalAmount: 1250, paidAmount: 0, paymentStatus: 'unpaid', specialRequests: 'Inquiring about spa packages.', createdDate: '2026-05-28' },
    { id: 'res-506', guestId: 'gst-206', guestName: 'Liam Neeson', roomId: undefined, roomNumber: undefined, roomType: 'Superior Room', checkIn: '2026-06-10', checkOut: '2026-06-12', status: 'cancelled', guestsCount: 1, totalAmount: 360, paidAmount: 0, paymentStatus: 'unpaid', specialRequests: 'Non-smoking room.', createdDate: '2026-05-20' }
  ]);

  readonly searchQuery = signal('');
  readonly filterStatus = signal<ReservationStatus | 'all'>('all');

  readonly filteredReservations = computed(() => {
    let list = this.reservations();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.filterStatus();

    if (query) {
      list = list.filter(r => 
        r.guestName.toLowerCase().includes(query) || 
        (r.roomNumber && r.roomNumber.includes(query)) ||
        r.roomType.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query)
      );
    }
    if (status !== 'all') {
      list = list.filter(r => r.status === status);
    }

    return list;
  });

  readonly upcomingReservationsCount = computed(() => 
    this.reservations().filter(r => r.status === 'confirmed').length
  );
  
  readonly checkInsTodayCount = computed(() => 
    this.reservations().filter(r => r.status === 'confirmed' && r.checkIn === '2026-05-29').length
  );

  readonly checkOutsTodayCount = computed(() => 
    this.reservations().filter(r => r.status === 'checked_in' && r.checkOut === '2026-05-29').length
  );

  addReservation(res: Omit<Reservation, 'id' | 'createdDate'>): void {
    const newRes: Reservation = {
      ...res,
      id: `res-${Math.floor(100 + Math.random() * 900)}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    this.reservations.update(prev => [newRes, ...prev]);
  }

  updateReservation(id: string, updatedFields: Partial<Reservation>): void {
    this.reservations.update(prev => 
      prev.map(res => res.id === id ? { ...res, ...updatedFields } : res)
    );
  }

  updateReservationStatus(id: string, status: ReservationStatus): void {
    this.updateReservation(id, { status });
  }

  deleteReservation(id: string): void {
    this.reservations.update(prev => prev.filter(res => res.id !== id));
  }
}
