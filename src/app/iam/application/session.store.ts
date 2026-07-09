import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthApi } from '../infrastructure/auth-api';
import { UserProfileApi } from '../infrastructure/user-profile-api';
import { UserProfileResponse } from '../infrastructure/user-profile-response';

export interface SessionUser {
  profileId: string;
  iamUserId: string;
  name: string;
  email: string;
  roles: string[];
  userType: string;
  planType: string;
  companyName?: string;
}

interface StoredSession {
  token: string;
  user: SessionUser;
}

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private authApi = inject(AuthApi);
  private userProfileApi = inject(UserProfileApi);
  private readonly storageKey = 'agrotrack_session';

  private readonly stored = this.readStoredSession();

  private tokenSignal = signal<string | null>(this.stored?.token ?? null);
  private userSignal = signal<SessionUser | null>(this.stored?.user ?? null);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  async signIn(email: string, password: string): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const auth = await firstValueFrom(this.authApi.signIn(email, password));
      // set the token now so the interceptor authorizes the GET /users/by-iam-user call below
      this.tokenSignal.set(auth.token);
      const profile = await firstValueFrom(this.userProfileApi.getByIamUserId(auth.id));
      this.applySession(auth.token, auth.id, auth.roles, profile);
      return true;
    } catch (err) {
      this.tokenSignal.set(null);
      this.errorSignal.set(this.extractMessage(err));
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    planType: string,
    companyName?: string
  ): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const auth = await firstValueFrom(this.authApi.signUp(email, password, planType));
      // set the token now so the interceptor authorizes the POST /users call below
      this.tokenSignal.set(auth.token);
      await firstValueFrom(this.userProfileApi.create({
        name,
        email,
        iam_user_id: auth.id,
        plan_type: planType,
        company_name: companyName,
      }));
      // registration does not keep the user signed in; they sign in explicitly afterwards
      this.tokenSignal.set(null);
      return true;
    } catch (err) {
      this.tokenSignal.set(null);
      this.errorSignal.set(this.extractMessage(err));
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  signOut(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private applySession(token: string, iamUserId: string, roles: string[], profile: UserProfileResponse): void {
    const user: SessionUser = {
      profileId: profile.id,
      iamUserId,
      name: profile.name,
      email: profile.email,
      roles,
      userType: profile.user_type,
      planType: profile.plan_type,
      companyName: profile.company_name,
    };
    this.tokenSignal.set(token);
    this.userSignal.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify({ token, user } satisfies StoredSession));
  }

  private readStoredSession(): StoredSession | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredSession;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private extractMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as { message?: string } | null;
      return body?.message ?? 'Unexpected error, please try again.';
    }
    return 'Unexpected error, please try again.';
  }
}
