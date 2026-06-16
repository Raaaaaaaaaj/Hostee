import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'receptionist' | 'housekeeper';
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly currentUser = signal<UserProfile | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly userRole = computed(() => this.currentUser()?.role || null);

  constructor() {
    this.restoreSession();
  }

  login(email: string, password: string): boolean {
    console.log('[AuthService] Initiating login for:', email);
    // Premium Mock Auth Credentials check
    if (email === 'admin@grandluxe.com' && password === 'admin123') {
      const profile: UserProfile = {
        id: 'usr-101',
        name: 'Alexander Mercer',
        email: 'admin@grandluxe.com',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces'
      };
      
      this.setUserSession(profile, 'mock-jwt-token-xyz');
      console.log('[AuthService] Session saved. Redirecting to /dashboard');
      this.toast.showSuccess('Welcome Back', `Logged in as ${profile.name}`);
      this.router.navigate(['/dashboard']);
      return true;
    } else if (email === 'manager@grandluxe.com' && password === 'manager123') {
      const profile: UserProfile = {
        id: 'usr-102',
        name: 'Sophie Dubois',
        email: 'manager@grandluxe.com',
        role: 'manager',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces'
      };
      
      this.setUserSession(profile, 'mock-jwt-token-manager');
      this.toast.showSuccess('Welcome Back', `Logged in as ${profile.name}`);
      this.router.navigate(['/dashboard']);
      return true;
    } else if (email === 'cleaner@grandluxe.com' && password === 'cleaner123') {
      const profile: UserProfile = {
        id: 'usr-103',
        name: 'Marcus Brody',
        email: 'cleaner@grandluxe.com',
        role: 'housekeeper',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces'
      };
      
      this.setUserSession(profile, 'mock-jwt-token-cleaner');
      this.toast.showSuccess('Welcome Back', `Logged in as ${profile.name}`);
      this.router.navigate(['/housekeeping']);
      return true;
    }

    this.toast.showError('Authentication Failed', 'Invalid email or password');
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('hms_auth_token');
    localStorage.removeItem('hms_user_profile');
    this.toast.showInfo('Logged Out', 'You have been successfully logged out');
    this.router.navigate(['/login']);
  }

  private setUserSession(profile: UserProfile, token: string): void {
    console.log('[AuthService] Saving user session profile:', profile.name);
    this.currentUser.set(profile);
    localStorage.setItem('hms_auth_token', token);
    localStorage.setItem('hms_user_profile', JSON.stringify(profile));
  }

  private restoreSession(): void {
    const token = localStorage.getItem('hms_auth_token');
    const profileJson = localStorage.getItem('hms_user_profile');
    
    if (token && profileJson) {
      try {
        const profile = JSON.parse(profileJson) as UserProfile;
        console.log('[AuthService] Restored user session:', profile.name);
        this.currentUser.set(profile);
      } catch (e) {
        console.log('[AuthService] Session restore failed, clearing storage');
        localStorage.removeItem('hms_auth_token');
        localStorage.removeItem('hms_user_profile');
      }
    } else {
      console.log('[AuthService] No prior user session to restore');
    }
  }
}
