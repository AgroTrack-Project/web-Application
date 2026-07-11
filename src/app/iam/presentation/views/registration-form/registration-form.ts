import { Component, AfterViewInit, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { SessionStore } from '../../../application/session.store';
import { StripePaymentService } from '../../../infrastructure/stripe-payment.service';
import { PaymentIntentApi } from '../../../infrastructure/payment-intent-api';
import { LanguageSwitcher } from '../../../../shared/presentation/components/language-switcher/language-switcher';
import { environment } from '../../../../../environments/environment';

interface Plan {
  id: 'basic' | 'pro' | 'enterprise';
  nameKey: string;
  price: string;
  descKey: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-registration-form',
  imports: [FormsModule, NgFor, NgIf, RouterLink, LanguageSwitcher, TranslatePipe],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.css',
})
export class RegistrationForm implements AfterViewInit, OnDestroy {
  @ViewChild('stripeCard') private stripeCardRef?: ElementRef<HTMLElement>;

  private sessionStore = inject(SessionStore);
  private stripeService = inject(StripePaymentService);
  private paymentIntentApi = inject(PaymentIntentApi);
  private router = inject(Router);

  readonly loading = this.sessionStore.loading;
  readonly error = this.sessionStore.error;
  readonly landingPageUrl = environment.landingPageUrl;

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly emailTouched = signal(false);
  readonly confirmPasswordTouched = signal(false);
  readonly paymentError = signal<string | null>(null);
  readonly processingPayment = signal(false);

  plans: Plan[] = [
    { id: 'basic',      nameKey: 'register.plan_basic_name',      price: 'S/ 39 / mes',  descKey: 'register.plan_basic_desc' },
    { id: 'pro',        nameKey: 'register.plan_pro_name',        price: 'S/ 85 / mes',  descKey: 'register.plan_pro_desc' },
    { id: 'enterprise', nameKey: 'register.plan_enterprise_name', price: 'S/ 149 / mes', descKey: 'register.plan_enterprise_desc' },
  ];

  form = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    plan: 'basic',
    companyName: '',
  };

  constructor() {
    this.sessionStore.clearError();
  }

  ngAfterViewInit(): void {
    if (this.stripeCardRef?.nativeElement) {
      this.stripeService.mountCardElement(this.stripeCardRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.stripeService.destroyCardElement();
  }

  get isEmailValid(): boolean {
    return EMAIL_PATTERN.test(this.form.email.trim());
  }

  get passwordsMatch(): boolean {
    return this.form.confirmPassword.length > 0 && this.form.password === this.form.confirmPassword;
  }

  get isPasswordStrong(): boolean {
    const v = this.form.password;
    return v.length >= 8 && /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v);
  }

  get canSubmit(): boolean {
    return !!this.form.fullName.trim()
      && this.isEmailValid
      && this.isPasswordStrong
      && this.passwordsMatch
      && (this.form.plan !== 'enterprise' || !!this.form.companyName.trim());
  }

  get isBusy(): boolean {
    return this.loading() || this.processingPayment();
  }

  togglePasswordVisibility(): void { this.showPassword.set(!this.showPassword()); }
  toggleConfirmPasswordVisibility(): void { this.showConfirmPassword.set(!this.showConfirmPassword()); }

  onPlanChange(planId: string): void {
    this.form.plan = planId;
    this.paymentError.set(null);
  }

  async onSubmit(): Promise<void> {
    this.emailTouched.set(true);
    this.confirmPasswordTouched.set(true);
    if (!this.canSubmit) return;

    const planType = this.form.plan.toUpperCase();
    const companyName = this.form.plan === 'enterprise' ? this.form.companyName : undefined;

    this.processingPayment.set(true);
    this.paymentError.set(null);
    try {
      const { client_secret } = await firstValueFrom(this.paymentIntentApi.create(planType));
      const paymentErr = await this.stripeService.confirmPayment(client_secret);
      if (paymentErr) {
        this.paymentError.set(paymentErr);
        return;
      }
      const ok = await this.sessionStore.register(this.form.fullName, this.form.email, this.form.password, planType, companyName);
      if (ok) this.router.navigate(['/login']);
    } catch {
      this.paymentError.set('Error procesando el pago. Por favor intentá de nuevo.');
    } finally {
      this.processingPayment.set(false);
    }
  }
}
