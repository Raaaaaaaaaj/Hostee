import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const auth = authService.isAuthenticated();
  console.log(`[authGuard] Path checked: "${state.url}", isAuthenticated:`, auth);

  if (auth) {
    return true;
  }

  console.log('[authGuard] Redirecting unauthenticated request to /login');
  router.navigate(['/login']);
  return false;
};
