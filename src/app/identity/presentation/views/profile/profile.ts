import { Component, ElementRef, OnDestroy, ViewChild, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { IdentityStore } from '../../../application/identity.store';
import { BasicPlan } from '../../../domain/model/basic-plan.entity';
import { EnterprisePlan } from '../../../domain/model/enterprise-plan.entity';
import { ProPlan } from '../../../domain/model/pro-plan.entity';
import { AgriculturalManager } from '../../../domain/model/agricultural-manager.entity';
import { Avatar } from '../../../../shared/presentation/components/avatar/avatar';
import { StripePaymentService } from '../../../../iam/infrastructure/stripe-payment.service';
import { PaymentIntentApi } from '../../../../iam/infrastructure/payment-intent-api';

type PlanType = 'BASIC' | 'PRO' | 'ENTERPRISE';

interface PlanInfo { labelKey: string; price: string; features: string[]; }

const PLAN_INFO: Record<PlanType, PlanInfo> = {
  BASIC: {
    labelKey: 'profile.plans.basic.label',
    price: 'S/ 39 / mes',
    features: ['profile.plans.basic.f1', 'profile.plans.basic.f2', 'profile.plans.basic.f3'],
  },
  PRO: {
    labelKey: 'profile.plans.pro.label',
    price: 'S/ 85 / mes',
    features: ['profile.plans.pro.f1', 'profile.plans.pro.f2', 'profile.plans.pro.f3', 'profile.plans.pro.f4', 'profile.plans.pro.f5'],
  },
  ENTERPRISE: {
    labelKey: 'profile.plans.enterprise.label',
    price: 'S/ 149 / mes',
    features: ['profile.plans.enterprise.f1', 'profile.plans.enterprise.f2', 'profile.plans.enterprise.f3', 'profile.plans.enterprise.f4'],
  },
};

const ALL_PLANS: PlanType[] = ['BASIC', 'PRO', 'ENTERPRISE'];
const PLAN_RANK: Record<PlanType, number> = { BASIC: 0, PRO: 1, ENTERPRISE: 2 };

@Component({
  selector: 'app-profile',
  imports: [TranslateModule, DatePipe, Avatar],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit, OnDestroy {
  @ViewChild('stripeCardRef') private stripeCardRef?: ElementRef<HTMLElement>;

  store           = inject(IdentityStore);
  private stripe  = inject(StripePaymentService);
  private piApi   = inject(PaymentIntentApi);

  editing           = signal(false);
  name              = signal('');
  email             = signal('');
  changingPlan      = signal(false);
  selectedPlan      = signal<PlanType | null>(null);
  paymentError      = signal<string | null>(null);
  processingPayment = signal(false);

  readonly planType = computed((): PlanType => {
    const user = this.store.currentUser();
    if (!user) return 'BASIC';
    if (user.getPlan() instanceof EnterprisePlan) return 'ENTERPRISE';
    if (user.getPlan() instanceof ProPlan)        return 'PRO';
    return 'BASIC';
  });

  readonly currentPlanInfo  = computed(() => PLAN_INFO[this.planType()]);
  readonly availablePlans   = computed(() =>
    ALL_PLANS.filter(p => PLAN_RANK[p] > PLAN_RANK[this.planType()])
  );
  readonly selectedPlanInfo = computed(() => {
    const s = this.selectedPlan();
    return s ? PLAN_INFO[s] : null;
  });

  readonly isManager   = computed(() => this.store.currentUser() instanceof AgriculturalManager);
  readonly companyName = computed(() => {
    const user = this.store.currentUser();
    return user instanceof AgriculturalManager ? user.getCompanyName() : null;
  });

  readonly isBusy = computed(() => this.store.loading() || this.processingPayment());

  getPlanInfo(type: PlanType): PlanInfo { return PLAN_INFO[type]; }

  ngOnInit(): void  { this.store.loadUsers(); }
  ngOnDestroy(): void { this.stripe.destroyCardElement(); }

  // ── profile edit ──────────────────────────────────────────────
  startEditing(): void {
    const user = this.store.currentUser();
    if (!user) return;
    this.name.set(user.getName());
    this.email.set(user.getEmail());
    this.editing.set(true);
  }

  cancelEditing(): void { this.editing.set(false); }

  saveChanges(): void {
    const user = this.store.currentUser();
    if (!user) return;
    user.updateProfile(this.name(), this.email());
    this.store.updateUser(user);
    this.editing.set(false);
  }

  onNameInput(e: Event):  void { this.name.set((e.target  as HTMLInputElement).value); }
  onEmailInput(e: Event): void { this.email.set((e.target as HTMLInputElement).value); }

  // ── plan change ───────────────────────────────────────────────
  startPlanChange(): void {
    this.changingPlan.set(true);
    this.selectedPlan.set(null);
    this.paymentError.set(null);
  }

  cancelPlanChange(): void {
    this.stripe.destroyCardElement();
    this.changingPlan.set(false);
    this.selectedPlan.set(null);
    this.paymentError.set(null);
  }

  selectPlan(type: PlanType): void {
    if (this.selectedPlan() === type) return;
    this.stripe.destroyCardElement();
    this.selectedPlan.set(type);
    this.paymentError.set(null);
    setTimeout(() => {
      if (this.stripeCardRef?.nativeElement) {
        this.stripe.mountCardElement(this.stripeCardRef.nativeElement);
      }
    }, 0);
  }

  async confirmPlanChange(): Promise<void> {
    const type = this.selectedPlan();
    if (!type) return;

    this.processingPayment.set(true);
    this.paymentError.set(null);
    try {
      const { client_secret } = await firstValueFrom(this.piApi.create(type));
      const err = await this.stripe.confirmPayment(client_secret);
      if (err) { this.paymentError.set(err); return; }

      const user = this.store.currentUser();
      if (!user) return;
      const newPlan = type === 'PRO' ? new ProPlan()
                    : type === 'ENTERPRISE' ? new EnterprisePlan()
                    : new BasicPlan();
      user.changePlan(newPlan);
      this.store.updateUser(user);

      this.stripe.destroyCardElement();
      this.changingPlan.set(false);
      this.selectedPlan.set(null);
    } catch {
      this.paymentError.set('Error procesando el pago. Intentá de nuevo.');
    } finally {
      this.processingPayment.set(false);
    }
  }
}
