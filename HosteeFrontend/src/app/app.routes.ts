import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'superadmin',
    loadComponent: () => import('./features/super-admin/super-admin.component').then(m => m.SuperAdminComponent)
  },
  {
    path: '',
    loadComponent: () => import('./core/layouts/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'superadmin',
        loadComponent: () => import('./features/super-admin/super-admin.component').then(m => m.SuperAdminComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'rooms',
        loadComponent: () => import('./features/rooms/rooms.component').then(m => m.RoomsComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/reservations/pages/reservations.component').then(m => m.ReservationsComponent)
      },
      {
        path: 'guests',
        loadComponent: () => import('./features/guests/guests.component').then(m => m.GuestsComponent)
      },
      {
        path: 'housekeeping',
        loadComponent: () => import('./features/housekeeping/housekeeping.component').then(m => m.HousekeepingComponent)
      },
      {
        path: 'billing',
        loadComponent: () => import('./features/billing/billing.component').then(m => m.BillingComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'ai-assistant',
        loadComponent: () => import('./features/ai-assistant/ai-assistant-page.component').then(m => m.AiAssistantPageComponent)
      },
      {
        path: 'website-builder',
        loadComponent: () => import('./features/website-builder/website-builder.component').then(m => m.WebsiteBuilderComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
