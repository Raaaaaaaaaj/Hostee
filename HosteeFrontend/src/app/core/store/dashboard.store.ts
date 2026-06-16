import { Injectable, signal, computed } from '@angular/core';
import { DashboardMetrics, MonthlyRevenueTrend } from '../api/api.types';

@Injectable({
  providedIn: 'root'
})
export class DashboardStore {
  readonly metrics = signal<DashboardMetrics>({
    occupancyRate: 75.6,
    adr: 285.5,
    revPar: 215.8,
    revenue: 48950.0,
    checkInsToday: 3,
    checkOutsToday: 1,
    availableRooms: 3,
    dirtyRooms: 2,
    upcomingReservations: 4
  });

  readonly revenueTrend = signal<MonthlyRevenueTrend[]>([
    { month: 'Jan', revenue: 32000, occupancy: 62 },
    { month: 'Feb', revenue: 38000, occupancy: 68 },
    { month: 'Mar', revenue: 41000, occupancy: 70 },
    { month: 'Apr', revenue: 45000, occupancy: 74 },
    { month: 'May', revenue: 48950, occupancy: 76 }
  ]);

  readonly activeNotifications = signal<Array<{ id: string; type: 'info' | 'warn' | 'success'; text: string; time: string }>>([
    { id: 'notif-1', type: 'info', text: 'VIP guest Victoria Sterling checked in to room 101', time: '10 mins ago' },
    { id: 'notif-2', type: 'warn', text: 'Room 202 compressor leak identified by maintenance crew', time: '1 hour ago' },
    { id: 'notif-3', type: 'success', text: 'Online booking generated for Executive Suite (Van Der Bilt)', time: '2 hours ago' },
    { id: 'notif-4', type: 'info', text: 'Housekeeping Sarah Connor completed cleaning room 203', time: '3 hours ago' }
  ]);

  readonly adrFormatted = computed(() => `$${this.metrics().adr.toFixed(2)}`);
  readonly revParFormatted = computed(() => `$${this.metrics().revPar.toFixed(2)}`);
  readonly revenueFormatted = computed(() => `$${this.metrics().revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

  addNotification(type: 'info' | 'warn' | 'success', text: string): void {
    const newNotif = {
      id: `notif-${Date.now()}`,
      type,
      text,
      time: 'Just now'
    };
    this.activeNotifications.update(prev => [newNotif, ...prev]);
  }

  clearNotification(id: string): void {
    this.activeNotifications.update(prev => prev.filter(n => n.id !== id));
  }

  updateMetrics(updatedMetrics: Partial<DashboardMetrics>): void {
    this.metrics.update(prev => ({ ...prev, ...updatedMetrics }));
  }
}
