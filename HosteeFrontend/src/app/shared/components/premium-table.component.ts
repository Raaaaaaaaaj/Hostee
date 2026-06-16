import { Component, input, output, contentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-premium-table',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  template: `
    <div class="w-full bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-elevated">
      <!-- Headers / Action Area -->
      <div class="px-6 py-4 border-b border-slate-50 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 class="text-lg font-bold text-slate-800 font-sans">{{ title() }}</h3>
          @if (subtitle()) {
            <p class="text-xs text-slate-400 font-medium font-sans mt-0.5">{{ subtitle() }}</p>
          }
        </div>
        <div class="flex items-center gap-3">
          <!-- Custom Header Action Slot -->
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>

      <!-- Table Body -->
      <div class="overflow-x-auto w-full">
        <table class="w-full border-collapse text-left">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100/50">
              @for (col of columns(); track col.field) {
                <th 
                  class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 font-sans border-b border-slate-100"
                  [style.width]="col.width || 'auto'">
                  {{ col.header }}
                </th>
              }
              @if (showActions()) {
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 font-sans border-b border-slate-100 text-right w-24">
                  Actions
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @if (loading()) {
              <!-- Skeleton Loaders -->
              @for (row of [1, 2, 3, 4]; track $index) {
                <tr class="border-b border-slate-50">
                  @for (col of columns(); track col.field) {
                    <td class="px-6 py-4">
                      <p-skeleton width="70%" height="1rem" styleClass="rounded-lg" />
                    </td>
                  }
                  @if (showActions()) {
                    <td class="px-6 py-4 text-right">
                      <p-skeleton width="40px" height="1.5rem" styleClass="ml-auto rounded-lg" />
                    </td>
                  }
                </tr>
              }
            } @else if (data().length === 0) {
              <!-- Empty State -->
              <tr>
                <td [attr.colspan]="columns().length + (showActions() ? 1 : 0)" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                    <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <i class="pi pi-folder-open text-xl"></i>
                    </div>
                    <h4 class="text-sm font-bold text-slate-700 font-sans">No Records Found</h4>
                    <p class="text-xs text-slate-400 font-medium font-sans">There are no records matching your current filter settings.</p>
                  </div>
                </td>
              </tr>
            } @else {
              <!-- Real Rows -->
              @for (item of data(); track trackKey() ? item[trackKey()!] : $index) {
                <tr 
                  class="border-b border-slate-50 hover:bg-slate-50/40 transition-colors duration-200 cursor-pointer"
                  (click)="rowClick.emit(item)">
                  @for (col of columns(); track col.field) {
                    <td class="px-6 py-4 text-sm font-medium text-slate-600 font-sans">
                      @if (columnTemplates()[col.field]) {
                        <!-- Render Custom Column Template -->
                        <ng-container *ngTemplateOutlet="columnTemplates()[col.field]; context: { $implicit: item }"></ng-container>
                      } @else {
                        {{ item[col.field] }}
                      }
                    </td>
                  }
                  @if (showActions()) {
                    <td class="px-6 py-4 text-right" (click)="$event.stopPropagation()">
                      <div class="flex items-center justify-end gap-1.5">
                        @if (rowActionsTemplate()) {
                          <ng-container *ngTemplateOutlet="rowActionsTemplate()!; context: { $implicit: item }"></ng-container>
                        }
                      </div>
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PremiumTableComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly columns = input.required<Array<{ field: string; header: string; width?: string }>>();
  readonly data = input.required<any[]>();
  readonly loading = input<boolean>(false);
  readonly showActions = input<boolean>(true);
  readonly trackKey = input<string>('');

  readonly rowClick = output<any>();

  // Map of column name -> custom templates passed via content projection
  readonly columnTemplates = input<Record<string, TemplateRef<any>>>({});
  
  // Custom row actions template passed via context
  readonly rowActionsTemplate = input<TemplateRef<any> | null>(null);
}
