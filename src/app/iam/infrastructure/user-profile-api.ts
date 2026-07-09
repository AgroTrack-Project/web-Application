import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfileResponse } from './user-profile-response';

export interface CreateUserProfileRequest {
  name: string;
  email: string;
  iam_user_id: string;
  plan_type: string;
  company_name?: string;
}

@Injectable({ providedIn: 'root' })
export class UserProfileApi {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}${environment.usersEndpointPath}`;

  create(payload: CreateUserProfileRequest): Observable<UserProfileResponse> {
    return this.http.post<UserProfileResponse>(this.baseUrl, payload);
  }

  getByIamUserId(iamUserId: string): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.baseUrl}/by-iam-user/${iamUserId}`);
  }
}
