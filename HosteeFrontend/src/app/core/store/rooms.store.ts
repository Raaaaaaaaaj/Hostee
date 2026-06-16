import { Injectable, signal, computed } from '@angular/core';
import { Room, RoomStatus, HousekeepingStatus } from '../api/api.types';

@Injectable({
  providedIn: 'root'
})
export class RoomsStore {
  readonly rooms = signal<Room[]>([
    { id: 'rm-101', number: '101', type: 'Deluxe Suite', status: 'occupied', housekeeping: 'dirty', occupancy: 2, maxOccupancy: 2, rate: 250, floor: 1, amenities: ['King Bed', 'Ocean View', 'Mini Bar', 'High-Speed WiFi'] },
    { id: 'rm-102', number: '102', type: 'Deluxe Suite', status: 'vacant', housekeeping: 'clean', occupancy: 0, maxOccupancy: 2, rate: 250, floor: 1, amenities: ['King Bed', 'Balcony', 'Mini Bar', 'High-Speed WiFi'] },
    { id: 'rm-103', number: '103', type: 'Superior Room', status: 'dirty', housekeeping: 'dirty', occupancy: 0, maxOccupancy: 2, rate: 180, floor: 1, amenities: ['Queen Bed', 'City View', 'Work Desk', 'High-Speed WiFi'] },
    { id: 'rm-104', number: '104', type: 'Superior Room', status: 'reserved', housekeeping: 'clean', occupancy: 0, maxOccupancy: 2, rate: 180, floor: 1, amenities: ['Queen Bed', 'City View', 'Work Desk', 'High-Speed WiFi'] },
    { id: 'rm-201', number: '201', type: 'Penthouse Presidential', status: 'occupied', housekeeping: 'clean', occupancy: 4, maxOccupancy: 6, rate: 950, floor: 2, amenities: ['3 King Beds', 'Panoramic Terrace', 'Private Jacuzzi', 'Chef Kitchen', 'iPad Control'] },
    { id: 'rm-202', number: '202', type: 'Executive Suite', status: 'maintenance', housekeeping: 'maintenance', occupancy: 0, maxOccupancy: 3, rate: 400, floor: 2, amenities: ['King Bed', 'Separate Lounge', 'Executive Club Lounge Access', 'High-Speed WiFi'] },
    { id: 'rm-203', number: '203', type: 'Superior Room', status: 'vacant', housekeeping: 'inspected', occupancy: 0, maxOccupancy: 2, rate: 180, floor: 2, amenities: ['Queen Bed', 'City View', 'Work Desk', 'High-Speed WiFi'] },
    { id: 'rm-204', number: '204', type: 'Executive Suite', status: 'occupied', housekeeping: 'clean', occupancy: 2, maxOccupancy: 3, rate: 400, floor: 2, amenities: ['King Bed', 'Separate Lounge', 'Mini Bar', 'High-Speed WiFi'] }
  ]);

  readonly searchQuery = signal('');
  readonly filterStatus = signal<RoomStatus | 'all'>('all');
  readonly filterType = signal<string | 'all'>('all');

  readonly filteredRooms = computed(() => {
    let list = this.rooms();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.filterStatus();
    const type = this.filterType();

    if (query) {
      list = list.filter(r => r.number.includes(query) || r.type.toLowerCase().includes(query));
    }
    if (status !== 'all') {
      list = list.filter(r => r.status === status);
    }
    if (type !== 'all') {
      list = list.filter(r => r.type === type);
    }

    return list;
  });

  readonly roomTypes = computed(() => {
    const types = new Set(this.rooms().map(r => r.type));
    return ['all', ...Array.from(types)];
  });

  readonly totalRoomsCount = computed(() => this.rooms().length);
  readonly occupiedCount = computed(() => this.rooms().filter(r => r.status === 'occupied').length);
  readonly vacantCount = computed(() => this.rooms().filter(r => r.status === 'vacant').length);
  readonly dirtyCount = computed(() => this.rooms().filter(r => r.housekeeping === 'dirty').length);
  readonly maintenanceCount = computed(() => this.rooms().filter(r => r.status === 'maintenance').length);

  addRoom(room: Omit<Room, 'id'>): void {
    const newRoom: Room = {
      ...room,
      id: `rm-${Date.now()}`
    };
    this.rooms.update(prev => [...prev, newRoom]);
  }

  updateRoom(id: string, updatedFields: Partial<Room>): void {
    this.rooms.update(prev => 
      prev.map(room => room.id === id ? { ...room, ...updatedFields } : room)
    );
  }

  updateRoomStatus(id: string, status: RoomStatus): void {
    this.updateRoom(id, { status });
  }

  updateRoomHousekeeping(id: string, housekeeping: HousekeepingStatus): void {
    this.updateRoom(id, { housekeeping });
  }

  deleteRoom(id: string): void {
    this.rooms.update(prev => prev.filter(room => room.id !== id));
  }
}
