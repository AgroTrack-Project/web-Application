import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticatedUserResponse } from './authenticated-user-response';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}${environment.authenticationEndpointPath}`;

  signUp(email: string, password: string, plan: string): Observable<AuthenticatedUserResponse> {
    return this.http.post<AuthenticatedUserResponse>(`${this.baseUrl}/sign-up`, { email, password, plan });
  }

  signIn(email: string, password: string): Observable<AuthenticatedUserResponse> {
    return this.http.post<AuthenticatedUserResponse>(`${this.baseUrl}/sign-in`, { email, password });
  }
}
