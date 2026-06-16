import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        let title = 'System Error';
        let detail = error.error?.message || error.message || 'An unexpected error occurred';

        switch (error.status) {
          case 401:
            title = 'Session Expired';
            detail = 'Please login again to continue';
            localStorage.removeItem('hms_auth_token');
            // Allow auth redirect if needed
            break;
          case 403:
            title = 'Access Denied';
            detail = 'You do not have permissions to perform this action';
            break;
          case 404:
            title = 'Not Found';
            detail = 'The requested resource could not be found';
            break;
          case 500:
            title = 'Server Error';
            detail = 'A critical error occurred on the server. Please try again later';
            break;
        }

        toastService.showError(title, detail);
      }
      return throwError(() => error);
    })
  );
};
