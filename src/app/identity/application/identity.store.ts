import { computed, inject, Injectable, signal } from '@angular/core';
import { IdentityApi } from '../infrastructure/identity-api';
import { User } from '../domain/model/user.entity';
import { Plan } from '../domain/model/plan.entity';
import { AlertPreference } from '../domain/model/alert-preference.entity';
import { BasicPlan } from '../domain/model/basic-plan.entity';
import { ProPlan } from '../domain/model/pro-plan.entity';
import { EnterprisePlan } from '../domain/model/enterprise-plan.entity';

@Injectable({ providedIn: 'root' })
export class IdentityStore {
  private identityApi = inject(IdentityApi);

  private usersSignal = signal<User[]>([]);
  private plansSignal = signal<Plan[]>([]);
  private alertPreferencesSignal = signal<AlertPreference[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private currentUserIdSignal = signal<string>('1');

  readonly users = this.usersSignal.asReadonly();
  readonly plans = this.plansSignal.asReadonly();
  readonly alertPreferences = this.alertPreferencesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly currentUser = computed(() => this.usersSignal().find(u => u.getId() === this.currentUserIdSignal()));
  readonly currentAlertPreference = computed(() => this.alertPreferencesSignal().find(p => p.getUserId() === this.currentUserIdSignal()));

  loadUsers(): void {
    this.loadingSignal.set(true);
    this.identityApi.users.getAll().subscribe({
      next: users => {
        this.usersSignal.set(users);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err.message);
        this.loadingSignal.set(false);
      }
    });
  }

  loadPlans(): void {
    this.loadingSignal.set(true);
    this.identityApi.plans.getAll().subscribe({
      next: plans => {
        this.plansSignal.set(plans);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err.message);
        this.loadingSignal.set(false);
      }
    });
  }

  loadAlertPreferences(): void {
    this.loadingSignal.set(true);
    this.identityApi.alertPreferences.getAll().subscribe({
      next: prefs => {
        this.alertPreferencesSignal.set(prefs);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err.message);
        this.loadingSignal.set(false);
      }
    });
  }

  updateUser(user: User): void {
    this.identityApi.users.update(user, user.getId()).subscribe({
      next: updated => {
        this.usersSignal.update(users => users.map(u => u.getId() === updated.getId() ? updated : u));
      },
      error: err => this.errorSignal.set(err.message)
    });
  }

  updateAlertPreference(pref: AlertPreference): void {
    this.identityApi.alertPreferences.update(pref, pref.id).subscribe({
      next: updated => {
        this.alertPreferencesSignal.update(prefs => prefs.map(p => p.id === updated.id ? updated : p));
      },
      error: err => this.errorSignal.set(err.message)
    });
  }

  switchCurrentUser(planType: 'BASIC' | 'PRO' | 'ENTERPRISE'): void {
    const target = this.usersSignal().find(u => {
      const plan = u.getPlan();
      if (planType === 'ENTERPRISE') return plan instanceof EnterprisePlan;
      if (planType === 'PRO')        return plan instanceof ProPlan;
      return plan instanceof BasicPlan;
    });
    if (target) this.currentUserIdSignal.set(target.getId());
  }

  getUserById(id: string): User | undefined {
    return this.usersSignal().find(u => u.getId() === id);
  }

  getAlertPreferenceByUserId(userId: string): AlertPreference | undefined {
    return this.alertPreferencesSignal().find(p => p.getUserId() === userId);
  }
}
