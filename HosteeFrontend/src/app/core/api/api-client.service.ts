import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private readonly http = inject(HttpClient);

  private getFullUrl(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    // Ensure base URL doesn't end with slash if endpoint starts with slash, or vice versa
    const base = API_CONFIG.baseUrl.replace(/\/$/, '');
    const path = endpoint.replace(/^\//, '');
    return `${base}/${path}`;
  }

  get<T>(endpoint: string, params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] }, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(this.getFullUrl(endpoint), {
      headers: headers || API_CONFIG.defaultHeaders,
      params: params instanceof HttpParams ? params : new HttpParams({ fromObject: params })
    });
  }

  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(this.getFullUrl(endpoint), body, {
      headers: headers || API_CONFIG.defaultHeaders
    });
  }

  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(this.getFullUrl(endpoint), body, {
      headers: headers || API_CONFIG.defaultHeaders
    });
  }

  patch<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(this.getFullUrl(endpoint), body, {
      headers: headers || API_CONFIG.defaultHeaders
    });
  }

  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(this.getFullUrl(endpoint), {
      headers: headers || API_CONFIG.defaultHeaders
    });
  }
}
