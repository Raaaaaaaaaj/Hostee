import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Skip showing loading indicator for background or fast tasks if desired
  const showLoader = !req.headers.has('X-Skip-Loader');
  
  if (showLoader) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (showLoader) {
        loadingService.hide();
      }
    })
  );
};
