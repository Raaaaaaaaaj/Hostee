import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AIDrawer } from '../../core/services/aiDrawer.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <aside
      class="h-screen bg-[#0B1224] text-white flex flex-col justify-between transition-all duration-300 z-30 shrink-0 border-r border-[#111A2E]/50 sticky top-0"
      [ngClass]="sidebarCollapsed() ? 'w-20' : 'w-72'"
    >
      <div>
        <!-- Logo Header -->
        <div class="flex items-center justify-between py-3 px-4">
        
        <div class="flex items-center gap-3 border-b border-[#111A2E]/30">
          <!-- <div
            class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 grow-0 shrink-0"
          >
            <i class="pi pi-building text-base text-white"></i>
          </div> -->
          @if (!sidebarCollapsed()) {
            <div class="flex flex-col">
              <span class="text-sm font-extrabold tracking-tight font-sans">Hostee</span>
              <span
                class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-sans"
                >PMS v2.0</span
              >
            </div>
          }
        </div>

        <div>
            <button 
              (click)="sidebarCollapsed.set(!sidebarCollapsed())"
              class="w-10 h-10 rounded-2xl hover:bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 transition-colors shadow-sm"
              title="Toggle Sidebar">
              <i [class]="sidebarCollapsed() ? 'pi pi-chevron-right' : 'pi pi-chevron-left'"></i>
            </button>
          </div>
          </div>

        <!-- Navigation Links -->
        <nav class="px-4 py-2 flex flex-col gap-2">
          @for (item of navigationItems(); track item.route) {
            @if (hasAccess(item.roles)) {
              <a
                [routerLink]="[item.route]"
                routerLinkActive="bg-[#1E293B] text-white shadow-sm font-extrabold"
                [routerLinkActiveOptions]="{ exact: item.exact || false }"
                #rla="routerLinkActive"
                [class.text-[#94A3B8]]="!rla.isActive"
                [class.font-medium]="!rla.isActive"
                class="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:text-white hover:bg-white/5 transition-all duration-200 group text-sm font-sans"
                [title]="item.label"
              >
                <i
                  [class]="
                    item.icon + ' text-base group-hover:scale-110 transition-transform duration-200'
                  "
                ></i>
                @if (!sidebarCollapsed()) {
                  <span>{{ item.label }}</span>
                }
              </a>
            }
          }
        </nav>
      </div>

      <!-- Sidebar Footer / Active User Widget -->
      <div class="p-4 border-t border-[#111A2E]/30 flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <img
            [src]="authService.currentUser()?.avatarUrl"
            class="w-10 h-10 rounded-2xl object-cover border border-[#1E293B]"
            alt="User Avatar"
          />
          @if (!sidebarCollapsed()) {
            <div class="flex flex-col overflow-hidden">
              <span class="text-xs font-bold font-sans text-slate-200 truncate">{{
                authService.currentUser()?.name
              }}</span>
              <span
                class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-sans"
                >{{ authService.userRole() }}</span
              >
            </div>
          }
        </div>

        @if (!sidebarCollapsed()) {
          <button
            (click)="authService.logout()"
            class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#1E293B]/40 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 border border-[#1E293B]/20 rounded-xl transition-all text-xs font-bold font-sans"
          >
            <i class="pi pi-sign-out"></i>
            Terminate Session
          </button>
        } @else {
          <button
            (click)="authService.logout()"
            class="w-10 h-10 mx-auto flex items-center justify-center bg-[#1E293B]/40 text-slate-400 hover:text-rose-400 border border-[#1E293B]/20 rounded-xl transition-all"
            title="Logout"
          >
            <i class="pi pi-sign-out"></i>
          </button>
        }
      </div>
    </aside>
  `,
  styles: ``,
})
export class Sidebar {
  readonly sidebarCollapsed = signal(false);
  // readonly aiSidebarVisible = signal(false);
  protected readonly aidrawerService = inject(AIDrawer)

  readonly authService = inject(AuthService);

  readonly navigationItems = signal<
    Array<{ label: string; icon: string; route: string; exact?: boolean; roles?: string[] }>
  >([
    { label: 'Dashboard', icon: 'pi pi-chart-bar', route: '/dashboard', exact: true },
    { label: 'Reservations', icon: 'pi pi-calendar', route: '/reservations' },
    { label: 'Rooms', icon: 'pi pi-building', route: '/rooms' },
    { label: 'Guests', icon: 'pi pi-users', route: '/guests' },
    { label: 'Housekeeping', icon: 'pi pi-sparkles', route: '/housekeeping' },
    { label: 'Billing', icon: 'pi pi-credit-card', route: '/billing' },
    { label: 'Reports', icon: 'pi pi-chart-line', route: '/reports' },
    { label: 'AI Assistant', icon: 'pi pi-comments', route: '/ai-assistant' },
    { label: 'Website Builder', icon: 'pi pi-globe', route: '/website-builder' },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings' },
  ]);

  hasAccess(roles?: string[]): boolean {
    if (!roles) return true;
    const currentRole = this.authService.userRole();
    return currentRole ? roles.includes(currentRole) : false;
  }
}
