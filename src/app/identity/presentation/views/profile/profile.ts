import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityStore } from '../../../application/identity.store';
import { ProPlan } from '../../../domain/model/pro-plan.entity';
import { EnterprisePlan } from '../../../domain/model/enterprise-plan.entity';

type PlanType = 'BASIC' | 'PRO' | 'ENTERPRISE';

interface PlanOption { name: string; desc: string; price: string; }
interface NextPlan   { label: string; features: string[]; }
interface PlanData   { label: string; features: string[]; upgrades: PlanOption[]; nextPlan: NextPlan | null; }

const PLAN_DATA: Record<PlanType, PlanData> = {
  BASIC: {
    label: 'profile.plans.basic.label',
    features: ['profile.plans.basic.f1', 'profile.plans.basic.f2', 'profile.plans.basic.f3'],
    upgrades: [
      { name: 'profile.upgrades.pro.name',        desc: 'profile.upgrades.pro.desc',        price: 'profile.upgrades.pro.price'        },
      { name: 'profile.upgrades.enterprise.name',  desc: 'profile.upgrades.enterprise.desc', price: 'profile.upgrades.enterprise.price' },
    ],
    nextPlan: {
      label: 'profile.plans.pro.label',
      features: ['profile.plans.pro.f1', 'profile.plans.pro.f2', 'profile.plans.pro.f3', 'profile.plans.pro.f4', 'profile.plans.pro.f5'],
    },
  },
  PRO: {
    label: 'profile.plans.pro.label',
    features: ['profile.plans.pro.f1', 'profile.plans.pro.f2', 'profile.plans.pro.f3', 'profile.plans.pro.f4', 'profile.plans.pro.f5'],
    upgrades: [
      { name: 'profile.upgrades.enterprise.name', desc: 'profile.upgrades.enterprise.desc', price: 'profile.upgrades.enterprise.price' },
    ],
    nextPlan: {
      label: 'profile.plans.enterprise.label',
      features: ['profile.plans.enterprise.f1', 'profile.plans.enterprise.f2', 'profile.plans.enterprise.f3', 'profile.plans.enterprise.f4'],
    },
  },
  ENTERPRISE: {
    label: 'profile.plans.enterprise.label',
    features: ['profile.plans.enterprise.f1', 'profile.plans.enterprise.f2', 'profile.plans.enterprise.f3', 'profile.plans.enterprise.f4'],
    upgrades: [],
    nextPlan: null,
  },
};

@Component({
  selector: 'app-profile',
  imports: [TranslateModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  store = inject(IdentityStore);

  editing = signal(false);
  name    = signal('');
  email   = signal('');

  readonly planType = computed((): PlanType => {
    const user = this.store.currentUser();
    if (!user) return 'BASIC';
    if (user.getPlan() instanceof EnterprisePlan) return 'ENTERPRISE';
    if (user.getPlan() instanceof ProPlan)        return 'PRO';
    return 'BASIC';
  });

  readonly planData = computed(() => PLAN_DATA[this.planType()]);

  ngOnInit(): void {
    this.store.loadUsers();
  }

  startEditing(): void {
    const user = this.store.currentUser();
    if (!user) return;
    this.name.set(user.getName());
    this.email.set(user.getEmail());
    this.editing.set(true);
  }

  cancelEditing(): void {
    this.editing.set(false);
  }

  saveChanges(): void {
    const user = this.store.currentUser();
    if (!user) return;
    user.updateProfile(this.name(), this.email());
    this.store.updateUser(user);
    this.editing.set(false);
  }

  onNameInput(e: Event):  void { this.name.set((e.target  as HTMLInputElement).value); }
  onEmailInput(e: Event): void { this.email.set((e.target as HTMLInputElement).value); }
}
