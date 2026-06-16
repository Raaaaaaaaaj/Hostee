import { Injectable, signal, computed } from '@angular/core';
import { Guest } from '../api/api.types';

@Injectable({
  providedIn: 'root'
})
export class GuestsStore {
  readonly guests = signal<Guest[]>([
    { id: 'gst-201', name: 'Victoria Sterling', email: 'victoria@sterling.com', phone: '+1 (555) 019-2834', loyaltyTier: 'platinum', stayCount: 15, totalSpent: 7850, preferences: ['Feather Pillows', 'Room far from elevator', 'Champagne on arrival'], notes: 'VIP Guest. CEO of Sterling Enterprises. Prefers highest floor.', documents: ['Passport_VS_2024.pdf', 'Corporate_ID_Sterling.pdf'], lastStay: '2026-05-28' },
    { id: 'gst-202', name: 'James Van Der Bilt', email: 'james@vanderbilt.co.uk', phone: '+44 20 7946 0958', loyaltyTier: 'gold', stayCount: 8, totalSpent: 12400, preferences: ['Tempur-pedic Mattress', 'Valet Parking', 'Espresso Pods'], notes: 'Prefers Penthouse Suite. Always requests private airport shuttle.', documents: ['Passport_JVDB_2025.pdf'], lastStay: '2026-05-29' },
    { id: 'gst-203', name: 'Emma Watson', email: 'emma@watson.org', phone: '+44 7700 900077', loyaltyTier: 'silver', stayCount: 3, totalSpent: 1100, preferences: ['Gluten-free menu', 'Extra hangers', 'Green tea'], notes: 'Vegan preferences. Prefers quiet environment.', documents: ['ID_Emma_Watson.pdf'], lastStay: '2026-01-14' },
    { id: 'gst-204', name: 'Arthur Dent', email: 'arthur@hitchhiker.space', phone: '+44 1632 960099', loyaltyTier: 'none', stayCount: 1, totalSpent: 1600, preferences: ['Teapot in room', 'Extra towels', 'Quiet room'], notes: 'Requested large bath towel. Enjoys hot tea in mornings.', documents: ['UK_DL_Dent.pdf'], lastStay: '2026-05-25' },
    { id: 'gst-205', name: 'Elena Rostova', email: 'elena@rostova.ru', phone: '+7 901 234-56-78', loyaltyTier: 'gold', stayCount: 5, totalSpent: 4200, preferences: ['Fresh orchids', 'Late checkout', 'Spa reservations'], notes: 'Prefers suites. Enjoys spa and wellness treatments.', documents: ['Visa_Rostova_2026.pdf'], lastStay: '2025-12-20' },
    { id: 'gst-206', name: 'Liam Neeson', email: 'liam@neeson.com', phone: '+1 (555) 723-9911', loyaltyTier: 'platinum', stayCount: 12, totalSpent: 9200, preferences: ['Blackout curtains', 'Gym access', 'High-security room'], notes: 'Requests discreet stay. Very active in gym facilities.', documents: ['Passport_L_Neeson.pdf'], lastStay: '2026-04-10' }
  ]);

  readonly searchQuery = signal('');
  readonly filterTier = signal<'all' | 'none' | 'silver' | 'gold' | 'platinum'>('all');

  readonly filteredGuests = computed(() => {
    let list = this.guests();
    const query = this.searchQuery().toLowerCase().trim();
    const tier = this.filterTier();

    if (query) {
      list = list.filter(g => 
        g.name.toLowerCase().includes(query) || 
        g.email.toLowerCase().includes(query) || 
        g.phone.includes(query)
      );
    }
    if (tier !== 'all') {
      list = list.filter(g => g.loyaltyTier === tier);
    }

    return list;
  });

  readonly totalGuestsCount = computed(() => this.guests().length);
  readonly VIPGuestsCount = computed(() => 
    this.guests().filter(g => g.loyaltyTier === 'gold' || g.loyaltyTier === 'platinum').length
  );

  addGuest(guest: Omit<Guest, 'id'>): void {
    const newGuest: Guest = {
      ...guest,
      id: `gst-${Math.floor(200 + Math.random() * 800)}`
    };
    this.guests.update(prev => [newGuest, ...prev]);
  }

  updateGuest(id: string, updatedFields: Partial<Guest>): void {
    this.guests.update(prev => 
      prev.map(g => g.id === id ? { ...g, ...updatedFields } : g)
    );
  }

  deleteGuest(id: string): void {
    this.guests.update(prev => prev.filter(g => g.id !== id));
  }
}
