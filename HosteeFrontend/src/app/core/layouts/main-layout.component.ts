import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet} from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { MenuModule } from 'primeng/menu';
import { DrawerModule } from 'primeng/drawer';
import { Sidebar } from '../../shared/components/sidebar.component';
import { Topbar } from '../../shared/components/topbar.component';
import { ChatBotDrawer } from '../../shared/components/chatbot.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuModule,
    DrawerModule,
    Sidebar,
    Topbar,
    ChatBotDrawer
  ],
  template: `
    <div class="min-h-screen w-full bg-slate-50 flex relative">
      
      <!-- Top request progress line indicator -->
      @if (loadingService.isLoading()) {
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 z-50 animate-pulse"></div>
      }

      <!-- Sidebar -->
      <app-sidebar></app-sidebar>
      <!-- Sidebar ends -->

      <!-- Main Panel Wrapper -->
      <div class="flex-1 flex flex-col min-w-0">

        <!-- Topbar -->
        <app-topbar></app-topbar>
        <!-- Topbar Ends -->

        <!-- Main Inner Workspace -->
        <main class="flex-1 overflow-y-auto px-8 py-8">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Chatbot Drawer -->
      <app-chatbotdrawer></app-chatbotdrawer>
      <!-- Chatbot Drawer ends -->

    </div>
  `
})
export class MainLayoutComponent {
  readonly loadingService = inject(LoadingService);
}
