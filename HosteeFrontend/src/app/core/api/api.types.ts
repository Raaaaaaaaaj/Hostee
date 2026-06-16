export type RoomStatus = 'vacant' | 'occupied' | 'dirty' | 'reserved' | 'maintenance';
export type HousekeepingStatus = 'dirty' | 'clean' | 'inspected' | 'maintenance';
export type ReservationStatus = 'inquiry' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export interface Room {
  id: string;
  number: string;
  type: string;
  status: RoomStatus;
  housekeeping: HousekeepingStatus;
  occupancy: number;
  maxOccupancy: number;
  rate: number;
  floor: number;
  amenities: string[];
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyTier: 'none' | 'silver' | 'gold' | 'platinum';
  stayCount: number;
  totalSpent: number;
  preferences: string[];
  notes: string;
  documents: string[];
  lastStay?: string;
}

export interface Reservation {
  id: string;
  guestId: string;
  guestName: string;
  roomId?: string;
  roomNumber?: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: ReservationStatus;
  guestsCount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  specialRequests?: string;
  createdDate: string;
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  status: HousekeepingStatus;
  assignedCleaner?: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  lastUpdated: string;
}

export interface DashboardMetrics {
  occupancyRate: number;
  adr: number;
  revPar: number;
  revenue: number;
  checkInsToday: number;
  checkOutsToday: number;
  availableRooms: number;
  dirtyRooms: number;
  upcomingReservations: number;
}

export interface MonthlyRevenueTrend {
  month: string;
  revenue: number;
  occupancy: number;
}
