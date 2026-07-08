import { computed, inject, Injectable, signal } from '@angular/core';
import { IdentityApi } from '../infrastructure/identity-api';
import { User } from '../domain/model/user.entity';
import { Plan, PlanType } from '../domain/model/plan.entity';
import { AlertPreference } from '../domain/model/alert-preference.entity';
import { BasicPlan } from '../domain/model/basic-plan.entity';
import { ProPlan } from '../domain/model/pro-plan.entity';
import { EnterprisePlan } from '../domain/model/enterprise-plan.entity';
import { Farmer } from '../domain/model/farmer.entity';
import { AgriculturalManager } from '../domain/model/agricultural-manager.entity';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  userType: 'farmer' | 'agricultural_manager';
  planType: PlanType;
  companyName?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class IdentityStore {
  private identityApi = inject(IdentityApi);
  private readonly usersStorageKey = 'agrotrack_iam_users';

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
  readonly currentUserId = this.currentUserIdSignal.asReadonly();
  readonly currentUser = computed(() => this.usersSignal().find(u => u.getId() === this.currentUserIdSignal()));
  readonly currentAlertPreference = computed(() => this.alertPreferencesSignal().find(p => p.getUserId() === this.currentUserIdSignal()));
  readonly currentPlanType = computed<PlanType>(() => this.resolvePlanType(this.currentUser()?.getPlan()));

  loadUsers(): void {
    const storedUsers = this.getStoredUsers();
    if (storedUsers.length > 0) {
      this.usersSignal.set(storedUsers);
      this.loadingSignal.set(false);
      return;
    }

    this.loadingSignal.set(true);
    this.identityApi.users.getAll().subscribe({
      next: users => {
        const loadedUsers = users.length ? users : this.seedUsers();
        this.usersSignal.set(loadedUsers);
        this.persistUsers();
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err.message);
        this.usersSignal.set(this.seedUsers());
        this.persistUsers();
        this.loadingSignal.set(false);
      }
    });
  }

  loadPlans(): void {
    this.loadingSignal.set(true);
    this.identityApi.plans.getAll().subscribe({
      next: plans => {
        this.plansSignal.set(plans.length ? plans : this.seedPlans());
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err.message);
        this.plansSignal.set(this.seedPlans());
        this.loadingSignal.set(false);
      }
    });
  }

  loadAlertPreferences(): void {
    this.loadingSignal.set(true);
    this.identityApi.alertPreferences.getAll().subscribe({
      next: prefs => {
        this.alertPreferencesSignal.set(prefs.length ? prefs : this.seedAlertPreferences());
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err.message);
        this.alertPreferencesSignal.set(this.seedAlertPreferences());
        this.loadingSignal.set(false);
      }
    });
  }

  updateUser(user: User): void {
    this.usersSignal.update(users => users.map(u => u.getId() === user.getId() ? user : u));
    this.persistUsers();

    this.identityApi.users.update(user, user.getId()).subscribe({
      next: updated => {
        this.usersSignal.update(users => users.map(u => u.getId() === updated.getId() ? updated : u));
        this.persistUsers();
      },
      error: err => this.errorSignal.set(err.message)
    });
  }

  createUser(user: User): void {
    this.usersSignal.update(users => [...users.filter(current => current.getId() !== user.getId()), user]);
    this.currentUserIdSignal.set(user.getId());
    this.persistUsers();

    this.identityApi.users.create(user).subscribe({
      next: created => {
        this.currentUserIdSignal.set(created.getId());
        this.usersSignal.update(users => users.map(current => current.getId() === user.getId() ? created : current));
        this.persistUsers();
      },
      error: err => this.errorSignal.set(err.message)
    });
  }

  signIn(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.usersSignal().find(current =>
      current.getEmail().toLowerCase() === normalizedEmail && current.getPassword() === password
    );

    if (!user) {
      this.errorSignal.set('Invalid email or password');
      return false;
    }

    this.currentUserIdSignal.set(user.getId());
    this.errorSignal.set(null);
    return true;
  }

  signOut(): void {
    this.currentUserIdSignal.set('');
    this.errorSignal.set(null);
  }

  registerFarmer(name: string, email: string, password: string, planType: PlanType): User {
    const now = new Date().toISOString();
    const user = new Farmer(crypto.randomUUID(), name.trim(), email.trim(), password, this.createPlan(planType), now, now);
    this.createUser(user);
    return user;
  }

  registerEnterpriseManager(
    name: string,
    email: string,
    password: string,
    companyName: string
  ): User {
    const now = new Date().toISOString();
    const user = new AgriculturalManager(
      crypto.randomUUID(),
      name.trim(),
      email.trim(),
      password,
      this.createPlan('ENTERPRISE'),
      now,
      now,
      companyName.trim()
    );
    this.createUser(user);
    return user;
  }

  recoverPassword(email: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = this.usersSignal().some(user => user.getEmail().toLowerCase() === normalizedEmail);
    this.errorSignal.set(exists ? null : 'Email not found');
    return exists;
  }

  updateAlertPreference(pref: AlertPreference): void {
    this.identityApi.alertPreferences.update(pref, pref.id).subscribe({
      next: updated => {
        this.alertPreferencesSignal.update(prefs => prefs.map(p => p.id === updated.id ? updated : p));
      },
      error: err => this.errorSignal.set(err.message)
    });
  }

  changeCurrentUserPlan(planType: PlanType): void {
    const user = this.currentUser();
    if (!user) return;

    user.changePlan(this.createPlan(planType));
    this.usersSignal.update(users => users.map(current => current.getId() === user.getId() ? user : current));
    this.persistUsers();
    this.updateUser(user);
  }

  getUserById(id: string): User | undefined {
    return this.usersSignal().find(u => u.getId() === id);
  }

  getAlertPreferenceByUserId(userId: string): AlertPreference | undefined {
    return this.alertPreferencesSignal().find(p => p.getUserId() === userId);
  }

  private createPlan(planType: PlanType): Plan {
    if (planType === 'ENTERPRISE') return new EnterprisePlan('enterprise');
    if (planType === 'PRO') return new ProPlan('pro');
    return new BasicPlan('basic');
  }

  private resolvePlanType(plan?: Plan): PlanType {
    if (plan instanceof EnterprisePlan) return 'ENTERPRISE';
    if (plan instanceof ProPlan) return 'PRO';
    return 'BASIC';
  }

  private seedUsers(): User[] {
    const now = new Date().toISOString();
    return [
      new Farmer('1', 'Usuario Agrotrack', 'usuario@agrotrack.com', '123456', new BasicPlan('basic'), now, now),
    ];
  }

  private seedPlans(): Plan[] {
    return [
      new BasicPlan('basic'),
      new ProPlan('pro'),
      new EnterprisePlan('enterprise'),
    ];
  }

  private seedAlertPreferences(): AlertPreference[] {
    return [
      new AlertPreference('1', this.currentUserIdSignal(), true, true, false),
    ];
  }

  private getStoredUsers(): User[] {
    const rawUsers = localStorage.getItem(this.usersStorageKey);
    if (!rawUsers) return [];

    try {
      const storedUsers = JSON.parse(rawUsers) as StoredUser[];
      return storedUsers.map(user => this.toUserFromStorage(user));
    } catch {
      localStorage.removeItem(this.usersStorageKey);
      return [];
    }
  }

  private persistUsers(): void {
    const storedUsers = this.usersSignal().map(user => this.toStoredUser(user));
    localStorage.setItem(this.usersStorageKey, JSON.stringify(storedUsers));
  }

  private toStoredUser(user: User): StoredUser {
    const isManager = user instanceof AgriculturalManager;
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      userType: isManager ? 'agricultural_manager' : 'farmer',
      planType: this.resolvePlanType(user.getPlan()),
      companyName: isManager ? user.getCompanyName() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private toUserFromStorage(user: StoredUser): User {
    const plan = this.createPlan(user.planType);
    if (user.userType === 'agricultural_manager') {
      return new AgriculturalManager(
        user.id,
        user.name,
        user.email,
        user.password,
        plan,
        user.createdAt,
        user.updatedAt,
        user.companyName ?? ''
      );
    }

    return new Farmer(user.id, user.name, user.email, user.password, plan, user.createdAt, user.updatedAt);
  }
}
