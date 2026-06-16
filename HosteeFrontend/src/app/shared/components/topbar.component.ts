import { Component, computed, signal, inject } from "@angular/core";
import { Router } from "@angular/router";
import { DashboardStore } from "../../core/store/dashboard.store";
import { CommonModule } from "@angular/common";
import { Popover } from 'primeng/popover';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { AIDrawer } from "../../core/services/aiDrawer.service";
import { ToggleThemeButton } from "../ui/buttons/toggle-theme-button/toggle-theme-button";

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        CommonModule,
        Popover,
        MenuModule,
        DrawerModule,
        ToggleThemeButton
    ],
    template: `
        <header class="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm backdrop-blur-md bg-white/90">
            <div class="hidden sm:block">
              <h2 class="text-lg font-extrabold text-slate-800 tracking-tight font-sans">
                {{ activePageTitle() }}
              </h2>
            </div>
          <!-- Right side: widgets & menu triggers -->
          <div class="flex items-center gap-3">
            
            <!-- Notion AI floating panel trigger button -->
            <button 
              (click)="aidrawerService.openAIDrawer()"
              class="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl hover:bg-indigo-100 hover:border-indigo-200 transition-all font-sans font-bold text-xs flex items-center gap-2 shadow-sm animate-float">
              <i class="pi pi-sparkles"></i>
              Ask Notion AI
            </button>
            <app-toggle-theme-button></app-toggle-theme-button>

            <!-- Quick Action Button -->
            <button 
              (click)="actionsMenu.toggle($event)"
              class="w-10 h-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-colors shadow-sm"
              title="Quick Actions">
              <i class="pi pi-plus text-xs"></i>
            </button>
            <p-menu #actionsMenu [model]="quickActionMenuItems()" [popup]="true" styleClass="rounded-2xl shadow-xl mt-2 border border-slate-100"></p-menu>

            <!-- Notifications Bell -->
            <button 
              (click)="notifPanel.toggle($event)"
              class="w-10 h-10 rounded-2xl hover:bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 relative transition-colors shadow-sm">
              <i class="pi pi-bell"></i>
              @if (dashboardStore.activeNotifications().length > 0) {
                <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
              }
            </button>
            <p-popover #notifPanel styleClass="rounded-3xl shadow-xl mt-2 border border-slate-100 w-80 p-0 overflow-hidden bg-white">
              <div class="px-5 py-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <span class="text-xs font-bold text-slate-700">Notifications</span>
                <span class="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 font-bold rounded-full">
                  {{ dashboardStore.activeNotifications().length }} Active
                </span>
              </div>
              <div class="max-h-64 overflow-y-auto">
                @if (dashboardStore.activeNotifications().length === 0) {
                  <div class="px-5 py-8 text-center text-slate-400 text-xs">No new notifications</div>
                } @else {
                  @for (notif of dashboardStore.activeNotifications(); track notif.id) {
                    <div class="px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50/30 flex items-start gap-3 transition-colors">
                      <div class="mt-0.5">
                        @if (notif.type === 'success') {
                          <i class="pi pi-check-circle text-emerald-500"></i>
                        } @else if (notif.type === 'warn') {
                          <i class="pi pi-exclamation-triangle text-amber-500"></i>
                        } @else {
                          <i class="pi pi-info-circle text-indigo-500"></i>
                        }
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-slate-600 leading-snug break-words">{{ notif.text }}</p>
                        <span class="text-[9px] text-slate-400 font-semibold block mt-1">{{ notif.time }}</span>
                      </div>
                      <button 
                        (click)="dashboardStore.clearNotification(notif.id)" 
                        class="text-slate-300 hover:text-slate-500 text-xs self-center"
                        title="Dismiss">
                        <i class="pi pi-times"></i>
                      </button>
                    </div>
                  }
                }
              </div>
            </p-popover>

          </div>
        </header>
    `,
    styles: `

    `
})

export class Topbar{

    private readonly router = inject(Router)
    protected readonly aidrawerService = inject(AIDrawer)
    readonly dashboardStore = inject(DashboardStore);
    

    readonly activePageTitle = computed(() => {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Operational Command';
    if (url.includes('/rooms')) return 'Rooms Inventory';
    if (url.includes('/reservations')) return 'Reservations Desk';
    if (url.includes('/guests')) return 'CRM Guest Profiles';
    if (url.includes('/housekeeping')) return 'Housekeeping Dispatch';
    if (url.includes('/billing')) return 'Premium Financials & Billing';
    if (url.includes('/reports')) return 'Strategic Analytics';
    if (url.includes('/ai-assistant')) return 'Enterprise AI Assistant';
    if (url.includes('/settings')) return 'Property Settings';
    if (url.includes('/website-builder')) return 'Digital Website Builder';
    return 'Grand Luxe Control';
  });

  readonly quickActionMenuItems = computed<MenuItem[]>(() => [
    {
      label: 'Operational Actions',
      items: [
        { label: 'Create Booking', icon: 'pi pi-calendar-plus', command: () => this.router.navigate(['/reservations']) },
        { label: 'Register Guest', icon: 'pi pi-user-plus', command: () => this.router.navigate(['/guests']) },
        { label: 'Review Alerts', icon: 'pi pi-info-circle', command: () => this.router.navigate(['/dashboard']) }
      ]
    }
  ]);

}