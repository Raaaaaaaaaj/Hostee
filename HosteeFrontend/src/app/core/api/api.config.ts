import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiBaseUrl,
  defaultHeaders: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }),
  timeoutMs: 15000
};
