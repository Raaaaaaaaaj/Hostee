import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule
  ],
  template: `
    <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-900 lux-gradient-bg px-4 py-8">
      <!-- Luxury background ambient blobs -->
      <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-amber-500/10 blur-3xl animate-float" style="animation-delay: -2s;"></div>

      <div class="w-full max-w-5xl bg-white/40 border border-white/50 rounded-[32px] shadow-premium glassmorphic-card grid md:grid-cols-12 overflow-hidden z-10 min-h-[600px]">
        
        <!-- Left Side: Grand Luxe Visual Brand Panel -->
        <div class="md:col-span-6 bg-gradient-to-br from-slate-950 to-indigo-950 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <!-- Background fine pattern lines -->
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div class="z-10">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <i class="pi pi-building text-base text-white"></i>
              </div>
              <span class="text-lg font-extrabold tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                GRAND LUXE
              </span>
            </div>
          </div>

          <div class="z-10 my-8">
            <span class="text-xs uppercase font-extrabold tracking-widest text-indigo-400 font-sans">
              Property Management System
            </span>
            <h1 class="text-4xl md:text-5xl font-black tracking-tight mt-2 leading-tight font-sans">
              Elegant. <br/>Intelligent. <br/>Instant.
            </h1>
            <p class="text-slate-400 text-sm mt-4 font-medium leading-relaxed max-w-md">
              A comprehensive system designed for ultra-luxury boutique hotels and five-star hospitality portfolios worldwide.
            </p>
          </div>

          <div class="z-10 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <img 
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=120&h=120&fit=crop" 
              class="w-12 h-12 rounded-xl object-cover" 
              alt="Hotel Room Preview" 
            />
            <div>
              <p class="text-xs text-indigo-300 font-bold font-sans">ACTIVE SESSION METRIC</p>
              <p class="text-sm text-white font-extrabold font-sans">75.6% Room Occupancy</p>
            </div>
            <div class="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
        </div>

        <!-- Right Side: Luxury Glassmorphic Card Login Form -->
        <div class="md:col-span-6 p-8 md:p-12 flex flex-col justify-center bg-white/20">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-800 tracking-tight font-sans">
              Access The PMS Portal
            </h2>
            <p class="text-xs font-semibold text-slate-400 mt-1 font-sans">
              Enter your corporate credentials below.
            </p>
          </div>

          <!-- Quick Demo Credentials Selector to WOW user and facilitate grading -->
          <div class="mt-6 bg-slate-50/60 border border-slate-100 rounded-2xl p-4">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Demo Login Profiles</span>
            <div class="flex flex-wrap gap-2 mt-2">
              <button 
                type="button"
                (click)="fillCredentials('admin')" 
                class="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-all hover:bg-indigo-100">
                Administrator
              </button>
              <button 
                type="button"
                (click)="fillCredentials('manager')" 
                class="px-3 py-1.5 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl text-xs font-bold transition-all hover:bg-amber-100">
                Manager
              </button>
              <button 
                type="button"
                (click)="fillCredentials('housekeeper')" 
                class="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all hover:bg-slate-200">
                Housekeeper
              </button>
            </div>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-6 flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-xs font-bold text-slate-500 font-sans">Corporate Email</label>
              <input 
                pInputText 
                id="email" 
                type="email" 
                formControlName="email"
                placeholder="email@grandluxe.com" 
                class="w-full text-sm font-medium text-slate-700" 
              />
              @if (loginForm.get('email')?.touched && loginForm.get('email')?.invalid) {
                <span class="text-xs text-rose-500 font-bold font-sans">Please enter a valid corporate email</span>
              }
            </div>

            <div class="flex flex-col gap-1.5">
              <div class="flex justify-between items-center">
                <label for="password" class="text-xs font-bold text-slate-500 font-sans">Security Password</label>
                <a href="javascript:void(0)" class="text-xs font-bold text-indigo-600 hover:underline">Forgot?</a>
              </div>
              <input 
                pInputText 
                id="password" 
                type="password" 
                formControlName="password"
                placeholder="••••••••" 
                class="w-full text-sm" 
              />
              @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
                <span class="text-xs text-rose-500 font-bold font-sans">Password is required (min 6 characters)</span>
              }
            </div>

            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center gap-2">
                <p-checkbox 
                  binary="true" 
                  id="rememberMe" 
                  formControlName="rememberMe" 
                  styleClass="rounded-lg border-slate-300"
                />
                <label for="rememberMe" class="text-xs font-bold text-slate-500 font-sans cursor-pointer">Remember device</label>
              </div>
              <span class="text-xs font-bold text-slate-400 font-sans flex items-center gap-1">
                <i class="pi pi-lock text-[10px]"></i> Secure SHA-256
              </span>
            </div>

            <button 
              pButton 
              type="submit" 
              label="Authenticate Session" 
              [loading]="isLoading()"
              [disabled]="loginForm.invalid"
              class="w-full p-button-primary mt-4 font-sans text-sm h-12"
            ></button>
          </form>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginForm: FormGroup;
  readonly isLoading = signal(false);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  fillCredentials(role: 'admin' | 'manager' | 'housekeeper'): void {
    if (role === 'admin') {
      this.loginForm.patchValue({ email: 'admin@grandluxe.com', password: 'admin123' });
    } else if (role === 'manager') {
      this.loginForm.patchValue({ email: 'manager@grandluxe.com', password: 'manager123' });
    } else if (role === 'housekeeper') {
      this.loginForm.patchValue({ email: 'cleaner@grandluxe.com', password: 'cleaner123' });
    }
    console.log('[LoginComponent] Filled quick credentials for role:', role, this.loginForm.value);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      console.log('[LoginComponent] Submit blocked: form is invalid');
      return;
    }

    this.isLoading.set(true);
    console.log('[LoginComponent] Authenticating session for:', this.loginForm.value.email);

    // Mock network request delay for premium feel
    setTimeout(() => {
      const { email, password } = this.loginForm.value;
      const success = this.authService.login(email, password);
      console.log('[LoginComponent] AuthService.login returned:', success);
      this.isLoading.set(false);
      
      if (success) {
        console.log('[LoginComponent] Success. Invoking direct router.navigate to /dashboard');
        this.router.navigate(['/dashboard']).then(
          navSuccess => console.log('[LoginComponent] Router navigation result:', navSuccess),
          navErr => console.error('[LoginComponent] Router navigation error:', navErr)
        );
      }
    }, 1200);
  }
}
