import { Injectable, signal, computed } from '@angular/core';
import { HousekeepingTask, HousekeepingStatus } from '../api/api.types';

@Injectable({
  providedIn: 'root'
})
export class HousekeepingStore {
  readonly tasks = signal<HousekeepingTask[]>([
    { id: 'hk-101', roomId: 'rm-101', roomNumber: '101', status: 'dirty', assignedCleaner: 'Marcus Brody', priority: 'high', notes: 'Checkout dirty room. Needs deep clean and linen replenishment.', lastUpdated: '2026-05-29T10:15:00Z' },
    { id: 'hk-102', roomId: 'rm-103', roomNumber: '103', status: 'dirty', assignedCleaner: 'Sarah Connor', priority: 'medium', notes: 'Stayover refresh. Extra coffee pods requested.', lastUpdated: '2026-05-29T11:00:00Z' },
    { id: 'hk-103', roomId: 'rm-102', roomNumber: '102', status: 'clean', assignedCleaner: 'Marcus Brody', priority: 'low', notes: 'Routine check done. Awaiting final inspection.', lastUpdated: '2026-05-29T09:30:00Z' },
    { id: 'hk-104', roomId: 'rm-203', roomNumber: '203', status: 'inspected', assignedCleaner: 'Sarah Connor', priority: 'low', notes: 'Inspected and certified ready for check-in.', lastUpdated: '2026-05-29T08:45:00Z' },
    { id: 'hk-105', roomId: 'rm-202', roomNumber: '202', status: 'maintenance', assignedCleaner: 'John Doe (Tech)', priority: 'high', notes: 'AC compressor failure. Maintenance crew working.', lastUpdated: '2026-05-29T10:00:00Z' }
  ]);

  readonly searchQuery = signal('');
  readonly filterStatus = signal<HousekeepingStatus | 'all'>('all');

  readonly filteredTasks = computed(() => {
    let list = this.tasks();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.filterStatus();

    if (query) {
      list = list.filter(t => 
        t.roomNumber.includes(query) || 
        (t.assignedCleaner && t.assignedCleaner.toLowerCase().includes(query))
      );
    }
    if (status !== 'all') {
      list = list.filter(t => t.status === status);
    }

    return list;
  });

  readonly dirtyTasksCount = computed(() => this.tasks().filter(t => t.status === 'dirty').length);
  readonly cleanTasksCount = computed(() => this.tasks().filter(t => t.status === 'clean').length);
  readonly inspectedTasksCount = computed(() => this.tasks().filter(t => t.status === 'inspected').length);

  readonly availableCleaners = signal<string[]>([
    'Marcus Brody',
    'Sarah Connor',
    'John Doe (Tech)',
    'Elena Petrova',
    'David Miller'
  ]);

  addTask(task: Omit<HousekeepingTask, 'id' | 'lastUpdated'>): void {
    const newTask: HousekeepingTask = {
      ...task,
      id: `hk-${Math.floor(100 + Math.random() * 900)}`,
      lastUpdated: new Date().toISOString()
    };
    this.tasks.update(prev => [...prev, newTask]);
  }

  updateTask(id: string, updatedFields: Partial<HousekeepingTask>): void {
    this.tasks.update(prev => 
      prev.map(t => t.id === id ? { ...t, ...updatedFields, lastUpdated: new Date().toISOString() } : t)
    );
  }

  updateTaskStatus(id: string, status: HousekeepingStatus): void {
    this.updateTask(id, { status });
  }

  assignCleaner(id: string, cleaner: string): void {
    this.updateTask(id, { assignedCleaner: cleaner });
  }

  deleteTask(id: string): void {
    this.tasks.update(prev => prev.filter(t => t.id !== id));
  }
}
