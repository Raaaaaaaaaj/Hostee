import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  customDomain?: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  subscriptionTier: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
  };
}

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-300">
      
      <!-- Top Executive Navigation Bar -->
      <header class="border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/80 backdrop-blur-md px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div class="flex items-center space-x-3.5">
            <div class="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-600/30">
              H
            </div>
            <div>
              <div class="flex items-center gap-2.5">
                <h1 class="text-xl font-extrabold tracking-tight text-[var(--text-main)] font-sans">
                  Hostee Super Admin
                </h1>
              </div>
              <p class="text-xs text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                <span>Multi-Tenant Architecture v1.0</span>
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <button 
              (click)="loadTenants()" 
              title="Reload Roster"
              class="px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary-btn-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm">
              <i class="pi pi-refresh" [class.animate-spin]="isLoading()"></i>
              <span class="hidden sm:inline">Refresh</span>
            </button>

            <button 
              (click)="openCreateModal()" 
              class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              <i class="pi pi-plus-circle text-base"></i>
              Create New Property
            </button>
          </div>

        </div>
      </header>

      <!-- Main Portal Body -->
      <main class="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        <!-- Alerts -->
        @if (successMsg()) {
          <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-between shadow-sm animate-fade-in">
            <div class="flex items-center gap-2.5">
              <i class="pi pi-check-circle text-xl"></i>
              <span class="font-semibold text-sm">{{ successMsg() }}</span>
            </div>
            <button (click)="successMsg.set('')" class="text-emerald-500 hover:text-emerald-700 p-1 cursor-pointer"><i class="pi pi-times"></i></button>
          </div>
        }

        @if (errorMsg()) {
          <div class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-between shadow-sm animate-fade-in">
            <div class="flex items-center gap-2.5">
              <i class="pi pi-exclamation-triangle text-xl"></i>
              <span class="font-semibold text-sm">{{ errorMsg() }}</span>
            </div>
            <button (click)="errorMsg.set('')" class="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"><i class="pi pi-times"></i></button>
          </div>
        }

        <!-- 4 Executive KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Card 1: Total Hotel Clients -->
          <div class="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Properties</span>
              <div class="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <i class="pi pi-building"></i>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-3xl font-extrabold text-[var(--text-main)] font-sans tracking-tight">{{ totalTenants() }}</div>
              <p class="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                <i class="pi pi-arrow-up-right"></i> Onboarded Tenants
              </p>
            </div>
          </div>

          <!-- Card 2: Active Properties -->
          <div class="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Active Properties</span>
              <div class="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <i class="pi pi-verified"></i>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-3xl font-extrabold text-emerald-500 font-sans tracking-tight">{{ activeTenants() }}</div>
              <p class="text-xs text-[var(--text-muted)] font-semibold mt-1">
                {{ totalTenants() > 0 ? mathRound((activeTenants() / totalTenants()) * 100) : 0 }}% operational health
              </p>
            </div>
          </div>

          <!-- Card 3: Total Hotel Users -->
          <div class="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Provisioned Staff</span>
              <div class="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <i class="pi pi-users"></i>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-3xl font-extrabold text-amber-500 font-sans tracking-tight">{{ totalUsers() }}</div>
              <p class="text-xs text-[var(--text-muted)] font-semibold mt-1">Across all hotel clients</p>
            </div>
          </div>

          <!-- Card 4: Enterprise & Premium Tiers -->
          <div class="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Paid Tiers</span>
              <div class="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <i class="pi pi-star"></i>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-sans tracking-tight">{{ paidTiersCount() }}</div>
              <p class="text-xs text-[var(--text-muted)] font-semibold mt-1">Enterprise & Premium Clients</p>
            </div>
          </div>

        </div>

        <!-- Filter & Search Toolbar -->
        <div class="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          <!-- Search Input -->
          <div class="relative w-full md:w-80">
            <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm"></i>
            <input 
              type="text" 
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Filter by hotel name, slug, or domain..."
              class="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-xs focus:outline-none focus:border-indigo-600 transition-all" />
            @if (searchQuery()) {
              <button (click)="searchQuery.set('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                <i class="pi pi-times"></i>
              </button>
            }
          </div>

          <!-- Subscription Tier Filter Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button 
              (click)="selectedTierFilter.set('ALL')"
              [class]="selectedTierFilter() === 'ALL' ? 'bg-indigo-600 text-white font-bold' : 'bg-[var(--bg-app)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary-btn-hover)] font-medium'"
              class="px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap">
              All Tiers
            </button>
            <button 
              (click)="selectedTierFilter.set('ENTERPRISE')"
              [class]="selectedTierFilter() === 'ENTERPRISE' ? 'bg-purple-600 text-white font-bold' : 'bg-[var(--bg-app)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary-btn-hover)] font-medium'"
              class="px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap">
              Enterprise
            </button>
            <button 
              (click)="selectedTierFilter.set('PREMIUM')"
              [class]="selectedTierFilter() === 'PREMIUM' ? 'bg-amber-600 text-white font-bold' : 'bg-[var(--bg-app)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary-btn-hover)] font-medium'"
              class="px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap">
              Premium
            </button>
            <button 
              (click)="selectedTierFilter.set('BASIC')"
              [class]="selectedTierFilter() === 'BASIC' ? 'bg-blue-600 text-white font-bold' : 'bg-[var(--bg-app)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary-btn-hover)] font-medium'"
              class="px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap">
              Basic
            </button>
            <button 
              (click)="selectedTierFilter.set('FREE')"
              [class]="selectedTierFilter() === 'FREE' ? 'bg-gray-700 text-white font-bold' : 'bg-[var(--bg-app)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary-btn-hover)] font-medium'"
              class="px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap">
              Free
            </button>
          </div>

          <!-- View Mode Toggle Buttons -->
          <div class="flex items-center gap-1 border border-[var(--border-subtle)] p-1 rounded-xl bg-[var(--bg-app)] shrink-0">
            <button 
              (click)="viewMode.set('table')"
              [class]="viewMode() === 'table' ? 'bg-[var(--bg-card)] text-indigo-600 shadow-sm font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'"
              class="px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer">
              <i class="pi pi-bars text-xs"></i>
              <span>Table</span>
            </button>
            <button 
              (click)="viewMode.set('grid')"
              [class]="viewMode() === 'grid' ? 'bg-[var(--bg-card)] text-indigo-600 shadow-sm font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'"
              class="px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer">
              <i class="pi pi-th-large text-xs"></i>
              <span>Cards</span>
            </button>
          </div>

        </div>

        <!-- Property Display Area -->
        @if (isLoading()) {
          <div class="p-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center text-[var(--text-muted)] space-y-4 shadow-sm">
            <i class="pi pi-spin pi-spinner text-4xl text-indigo-600"></i>
            <p class="text-sm font-semibold">Querying master PostgreSQL database...</p>
          </div>
        } @else if (filteredTenants().length === 0) {
          <div class="p-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center text-[var(--text-muted)] space-y-4 shadow-sm">
            <div class="h-16 w-16 rounded-full bg-gray-500/10 text-gray-400 mx-auto flex items-center justify-center text-3xl">
              <i class="pi pi-inbox"></i>
            </div>
            <div>
              <p class="text-base font-bold text-[var(--text-main)]">No matching hotel clients found</p>
              <p class="text-xs text-[var(--text-muted)] mt-1">Try resetting search filters or provision a new hotel property.</p>
            </div>
            <button (click)="openCreateModal()" class="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-md">
              Provision New Hotel
            </button>
          </div>
        } @else {
          
          <!-- View Option A: GRID CARDS -->
          @if (viewMode() === 'grid') {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (tenant of filteredTenants(); track tenant.id) {
                <div class="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col justify-between">
                  
                  <!-- Card Header Banner -->
                  <div class="p-6 border-b border-[var(--border-subtle)] space-y-4 bg-gradient-to-b from-indigo-500/5 to-transparent">
                    <div class="flex items-start justify-between">
                      <div class="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                        {{ tenant.name.charAt(0).toUpperCase() }}
                      </div>
                      <div class="flex items-center space-x-2">
                        <span 
                          [class]="getTierBadgeClass(tenant.subscriptionTier)"
                          class="px-2.5 py-1 rounded-full text-[11px] font-extrabold border uppercase tracking-wider">
                          {{ tenant.subscriptionTier }}
                        </span>
                        <span 
                          [class]="getStatusBadgeClass(tenant.status)"
                          class="px-2.5 py-1 rounded-full text-[11px] font-extrabold border flex items-center gap-1.5">
                          <span class="h-1.5 w-1.5 rounded-full" [class]="tenant.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                          {{ tenant.status }}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 class="text-lg font-extrabold text-[var(--text-main)] tracking-tight group-hover:text-indigo-600 transition-colors">
                        {{ tenant.name }}
                      </h3>
                      <p class="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                        {{ tenant.customDomain || 'Standard Hostee Domain' }}
                      </p>
                    </div>
                  </div>

                  <!-- Card Details -->
                  <div class="p-6 space-y-3.5 text-xs text-[var(--text-muted)] flex-1">
                    <div class="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                      <span class="font-medium">Tenant Slug</span>
                      <code class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        {{ tenant.slug }}
                      </code>
                    </div>

                    <div class="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                      <span class="font-medium">Staff Accounts</span>
                      <span class="font-bold text-[var(--text-main)] flex items-center gap-1">
                        <i class="pi pi-users text-indigo-500"></i>
                        {{ tenant._count?.users || 0 }} Provisioned Users
                      </span>
                    </div>

                    <div class="flex items-center justify-between py-1.5">
                      <span class="font-medium">Onboarded On</span>
                      <span class="font-semibold text-[var(--text-main)]">{{ formatDate(tenant.createdAt) }}</span>
                    </div>
                  </div>

                  <!-- Card Actions Footer -->
                  <div class="p-4 border-t border-[var(--border-subtle)] bg-sky-50 flex items-center justify-between">
                    <span class="text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[150px]" title="{{ tenant.id }}">
                      ID: {{ tenant.id.substring(0, 8) }}...
                    </span>

                    <div class="flex items-center space-x-2">
                      <button 
                        (click)="openEditModal(tenant)" 
                        title="Edit Hotel Details"
                        class="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                        <i class="pi pi-pencil text-xs"></i> Edit
                      </button>

                      <button 
                        (click)="confirmDeleteTenant(tenant)" 
                        title="Delete Hotel Tenant"
                        class="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                        <i class="pi pi-trash text-xs"></i> Delete
                      </button>
                    </div>
                  </div>

                </div>
              }
            </div>
          }

          <!-- View Option B: EXECUTIVE TABLE -->
          @if (viewMode() === 'table') {
            <div class="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm overflow-hidden animate-fade-in">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead class="bg-gray-50/60 dark:bg-gray-800/60 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                    <tr>
                      <th class="px-6 py-4">Hotel Property</th>
                      <th class="px-6 py-4">Tenant Slug</th>
                      <th class="px-6 py-4">Subscription Tier</th>
                      <th class="px-6 py-4">Status</th>
                      <th class="px-6 py-4">Staff Count</th>
                      <th class="px-6 py-4">Onboard Date</th>
                      <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[var(--border-subtle)]">
                    @for (tenant of filteredTenants(); track tenant.id) {
                      <tr class="hover:bg-indigo-500/5 transition-colors group">
                        <td class="px-6 py-4 font-semibold text-[var(--text-main)] flex items-center gap-3.5">
                          <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center shadow-md">
                            {{ tenant.name.charAt(0).toUpperCase() }}
                          </div>
                          <div>
                            <div class="text-sm font-bold text-[var(--text-main)] group-hover:text-indigo-600 transition-colors">{{ tenant.name }}</div>
                            <div class="text-xs font-normal text-[var(--text-muted)]">{{ tenant.customDomain || 'Standard Hostee Domain' }}</div>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <code class="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                            {{ tenant.slug }}
                          </code>
                        </td>
                        <td class="px-6 py-4">
                          <span 
                            [class]="getTierBadgeClass(tenant.subscriptionTier)"
                            class="px-2.5 py-1 rounded-full text-xs font-extrabold border tracking-wider">
                            {{ tenant.subscriptionTier }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <span 
                            [class]="getStatusBadgeClass(tenant.status)"
                            class="px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5">
                            <span class="h-1.5 w-1.5 rounded-full" [class]="tenant.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                            {{ tenant.status }}
                          </span>
                        </td>
                        <td class="px-6 py-4 font-bold text-[var(--text-main)]">
                          <i class="pi pi-users text-xs text-indigo-500 mr-1.5"></i>
                          {{ tenant._count?.users || 0 }} Staff
                        </td>
                        <td class="px-6 py-4 text-xs font-medium text-[var(--text-muted)]">
                          {{ formatDate(tenant.createdAt) }}
                        </td>
                        <td class="px-6 py-4 text-right">
                          <div class="flex items-center justify-end space-x-2">
                            <button 
                              (click)="openEditModal(tenant)" 
                              title="Edit Hotel Property"
                              class="h-9 w-9 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all hover:scale-105 cursor-pointer">
                              <i class="pi pi-pencil text-xs"></i>
                            </button>

                            <button 
                              (click)="confirmDeleteTenant(tenant)" 
                              title="Delete Hotel Property"
                              class="h-9 w-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-all hover:scale-105 cursor-pointer">
                              <i class="pi pi-trash text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

        }

      </main>

      <!-- Provision New Hotel Modal -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div class="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 overflow-hidden relative">
            
            <div class="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div class="flex items-center space-x-3">
                <div class="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xl font-bold">
                  <i class="pi pi-plus"></i>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-[var(--text-main)]">Provision New Hotel Property</h3>
                  <p class="text-xs text-[var(--text-muted)]">Onboard client tenant & register initial admin</p>
                </div>
              </div>
              <button (click)="closeCreateModal()" class="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <i class="pi pi-times text-lg"></i>
              </button>
            </div>

            <form (ngSubmit)="submitCreateTenant()" class="space-y-4">
              
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Hotel Property Name *</label>
                <input 
                  type="text" 
                  [(ngModel)]="createFormData.name" 
                  (ngModelChange)="onCreateNameChange()"
                  name="name" 
                  placeholder="e.g. Grand Luxe Hotel" 
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-sm font-semibold focus:outline-none focus:border-indigo-600 transition-all" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Tenant Slug *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="createFormData.slug" 
                    name="slug" 
                    placeholder="grandluxe" 
                    required
                    class="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-sm font-mono font-bold focus:outline-none focus:border-indigo-600 transition-all" />
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Subscription Tier</label>
                  <select 
                    [(ngModel)]="createFormData.subscriptionTier" 
                    name="subscriptionTier"
                    class="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-sm font-semibold focus:outline-none focus:border-indigo-600 transition-all">
                    <option value="FREE">FREE</option>
                    <option value="BASIC">BASIC</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </div>
              </div>

              <div class="pt-3 border-t border-[var(--border-subtle)] space-y-3">
                <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Initial Hotel Admin Account</span>
                
                <div>
                  <label class="block text-xs font-medium text-[var(--text-muted)] mb-1">Admin Full Name</label>
                  <input 
                    type="text" 
                    [(ngModel)]="createFormData.adminName" 
                    name="adminName" 
                    placeholder="Alexander Mercer" 
                    class="w-full px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-sm focus:outline-none focus:border-indigo-600 transition-all" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-[var(--text-muted)] mb-1">Admin Email</label>
                    <input 
                      type="email" 
                      [(ngModel)]="createFormData.adminEmail" 
                      name="adminEmail" 
                      placeholder="admin@hotel.com" 
                      class="w-full px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-sm focus:outline-none focus:border-indigo-600 transition-all" />
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-[var(--text-muted)] mb-1">Admin Password</label>
                    <input 
                      type="password" 
                      [(ngModel)]="createFormData.adminPassword" 
                      name="adminPassword" 
                      placeholder="••••••••" 
                      class="w-full px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-sm focus:outline-none focus:border-indigo-600 transition-all" />
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end space-x-3 pt-4 border-t border-[var(--border-subtle)]">
                <button 
                  type="button" 
                  (click)="closeCreateModal()" 
                  class="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-secondary-btn-hover)] transition-colors cursor-pointer">
                  Cancel
                </button>

                <button 
                  type="submit" 
                  [disabled]="isSubmitting()"
                  class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                  @if (isSubmitting()) {
                    <i class="pi pi-spinner pi-spin"></i> Provisioning...
                  } @else {
                    <i class="pi pi-check"></i> Provision Hotel Client
                  }
                </button>
              </div>
            </form>

          </div>
        </div>
      }

      <!-- Edit Hotel Property Modal -->
      @if (showEditModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div class="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 overflow-hidden relative">
            
            <div class="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div class="flex items-center space-x-3">
                <div class="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xl font-bold">
                  <i class="pi pi-pencil"></i>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-[var(--text-main)]">Edit Hotel Property</h3>
                  <p class="text-xs text-[var(--text-muted)]">Update tenant configuration & tier</p>
                </div>
              </div>
              <button (click)="closeEditModal()" class="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <i class="pi pi-times text-lg"></i>
              </button>
            </div>

            <form (ngSubmit)="submitUpdateTenant()" class="space-y-4">
              
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Hotel Property Name *</label>
                <input 
                  type="text" 
                  [(ngModel)]="editFormData.name" 
                  name="editName" 
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-sm font-semibold focus:outline-none focus:border-indigo-600 transition-all" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Tenant Slug *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editFormData.slug" 
                    name="editSlug" 
                    required
                    class="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-sm font-mono font-bold focus:outline-none focus:border-indigo-600 transition-all" />
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Subscription Tier</label>
                  <select 
                    [(ngModel)]="editFormData.subscriptionTier" 
                    name="editSubscriptionTier"
                    class="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-sm font-semibold focus:outline-none focus:border-indigo-600 transition-all">
                    <option value="FREE">FREE</option>
                    <option value="BASIC">BASIC</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Operational Status</label>
                  <select 
                    [(ngModel)]="editFormData.status" 
                    name="editStatus"
                    class="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-sm font-semibold focus:outline-none focus:border-indigo-600 transition-all">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Custom Domain</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editFormData.customDomain" 
                    name="editCustomDomain" 
                    placeholder="hotel.com" 
                    class="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] text-sm focus:outline-none focus:border-indigo-600 transition-all" />
                </div>
              </div>

              <div class="flex items-center justify-end space-x-3 pt-4 border-t border-[var(--border-subtle)]">
                <button 
                  type="button" 
                  (click)="closeEditModal()" 
                  class="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-secondary-btn-hover)] transition-colors cursor-pointer">
                  Cancel
                </button>

                <button 
                  type="submit" 
                  [disabled]="isSubmitting()"
                  class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                  @if (isSubmitting()) {
                    <i class="pi pi-spinner pi-spin"></i> Saving...
                  } @else {
                    <i class="pi pi-save"></i> Save Changes
                  }
                </button>
              </div>
            </form>

          </div>
        </div>
      }

      <!-- Delete Confirmation Modal -->
      @if (showDeleteModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div class="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center">
            
            <div class="h-16 w-16 rounded-full bg-rose-500/10 text-rose-600 mx-auto flex items-center justify-center text-3xl shadow-inner">
              <i class="pi pi-exclamation-triangle"></i>
            </div>

            <div>
              <h3 class="text-xl font-extrabold text-[var(--text-main)] font-sans">Delete Hotel Property?</h3>
              <p class="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                Are you sure you want to permanently delete <strong class="text-[var(--text-main)] font-bold">'{{ selectedTenantToDelete()?.name }}'</strong>? All staff accounts bound to this tenant will be removed.
              </p>
            </div>

            <div class="flex items-center justify-center space-x-3 pt-2">
              <button 
                (click)="closeDeleteModal()" 
                class="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-secondary-btn-hover)] transition-colors cursor-pointer">
                Cancel
              </button>

              <button 
                (click)="executeDeleteTenant()" 
                [disabled]="isSubmitting()"
                class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                @if (isSubmitting()) {
                  <i class="pi pi-spinner pi-spin"></i> Deleting...
                } @else {
                  <i class="pi pi-trash"></i> Delete Hotel
                }
              </button>
            </div>

          </div>
        </div>
      }

    </div>
  `
})
export class SuperAdminComponent implements OnInit {
  private apiClient = inject(ApiClientService);

  tenants = signal<Tenant[]>([]);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  
  viewMode = signal<'table' | 'grid'>('grid');
  searchQuery = signal<string>('');
  selectedTierFilter = signal<string>('ALL');

  showCreateModal = signal<boolean>(false);
  showEditModal = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);

  selectedTenantToEdit = signal<Tenant | null>(null);
  selectedTenantToDelete = signal<Tenant | null>(null);

  errorMsg = signal<string>('');
  successMsg = signal<string>('');

  createFormData = {
    name: '',
    slug: '',
    subscriptionTier: 'FREE' as const,
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  };

  editFormData: {
    id: string;
    name: string;
    slug: string;
    customDomain: string;
    subscriptionTier: Tenant['subscriptionTier'];
    status: Tenant['status'];
  } = {
    id: '',
    name: '',
    slug: '',
    customDomain: '',
    subscriptionTier: 'FREE',
    status: 'ACTIVE'
  };

  totalTenants = computed(() => this.tenants().length);
  activeTenants = computed(() => this.tenants().filter(t => t.status === 'ACTIVE').length);
  totalUsers = computed(() => this.tenants().reduce((acc, t) => acc + (t._count?.users || 0), 0));
  paidTiersCount = computed(() => this.tenants().filter(t => t.subscriptionTier === 'ENTERPRISE' || t.subscriptionTier === 'PREMIUM').length);

  filteredTenants = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const tier = this.selectedTierFilter();

    return this.tenants().filter(t => {
      const matchesSearch = !query || 
        t.name.toLowerCase().includes(query) || 
        t.slug.toLowerCase().includes(query) || 
        (t.customDomain && t.customDomain.toLowerCase().includes(query));
      
      const matchesTier = tier === 'ALL' || t.subscriptionTier === tier;

      return matchesSearch && matchesTier;
    });
  });

  ngOnInit() {
    this.loadTenants();
  }

  loadTenants() {
    this.isLoading.set(true);
    this.errorMsg.set('');

    this.apiClient.get<any>(API_ENDPOINTS.TENANTS.GET_ALL).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response && response.success && response.data) {
          this.tenants.set(response.data);
        } else {
          this.errorMsg.set(response?.message || 'Failed to load hotel clients');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err?.error?.message || 'Error connecting to Hostee master server');
      }
    });
  }

  // --- Create Modal Handlers ---
  openCreateModal() {
    this.showCreateModal.set(true);
    this.createFormData = {
      name: '',
      slug: '',
      subscriptionTier: 'FREE',
      adminName: '',
      adminEmail: '',
      adminPassword: ''
    };
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  onCreateNameChange() {
    if (this.createFormData.name) {
      this.createFormData.slug = this.createFormData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '');
    }
  }

  submitCreateTenant() {
    if (!this.createFormData.name || !this.createFormData.slug) {
      this.errorMsg.set('Please provide both hotel name and tenant slug.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    this.apiClient.post<any>(API_ENDPOINTS.TENANTS.CREATE, this.createFormData).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response && response.success) {
          this.successMsg.set(`Hotel property '${response.data?.tenant?.name}' provisioned successfully!`);
          this.closeCreateModal();
          this.loadTenants();
        } else {
          this.errorMsg.set(response?.message || 'Failed to create hotel tenant');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(err?.error?.message || 'Error creating hotel tenant');
      }
    });
  }

  // --- Edit Modal Handlers ---
  openEditModal(tenant: Tenant) {
    this.selectedTenantToEdit.set(tenant);
    this.editFormData = {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      customDomain: tenant.customDomain || '',
      subscriptionTier: tenant.subscriptionTier,
      status: tenant.status
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedTenantToEdit.set(null);
  }

  submitUpdateTenant() {
    if (!this.editFormData.name || !this.editFormData.slug) {
      this.errorMsg.set('Please provide both hotel name and tenant slug.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    const payload = {
      name: this.editFormData.name,
      slug: this.editFormData.slug,
      customDomain: this.editFormData.customDomain || null,
      subscriptionTier: this.editFormData.subscriptionTier,
      status: this.editFormData.status
    };

    this.apiClient.put<any>(API_ENDPOINTS.TENANTS.UPDATE(this.editFormData.id), payload).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response && response.success) {
          this.successMsg.set(`Hotel property '${response.data?.name}' updated successfully!`);
          this.closeEditModal();
          this.loadTenants();
        } else {
          this.errorMsg.set(response?.message || 'Failed to update hotel tenant');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(err?.error?.message || 'Error updating hotel tenant');
      }
    });
  }

  // --- Delete Handlers ---
  confirmDeleteTenant(tenant: Tenant) {
    this.selectedTenantToDelete.set(tenant);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedTenantToDelete.set(null);
  }

  executeDeleteTenant() {
    const tenant = this.selectedTenantToDelete();
    if (!tenant) return;

    this.isSubmitting.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    this.apiClient.delete<any>(API_ENDPOINTS.TENANTS.DELETE(tenant.id)).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response && response.success) {
          this.successMsg.set(`Hotel property '${tenant.name}' deleted successfully.`);
          this.closeDeleteModal();
          this.loadTenants();
        } else {
          this.errorMsg.set(response?.message || 'Failed to delete hotel tenant');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(err?.error?.message || 'Error deleting hotel tenant');
      }
    });
  }

  getTierBadgeClass(tier: string): string {
    switch (tier) {
      case 'ENTERPRISE':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'PREMIUM':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'BASIC':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'SUSPENDED':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'INACTIVE':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  mathRound(val: number): number {
    return Math.round(val);
  }
}
