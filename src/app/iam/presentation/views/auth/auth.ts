import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IdentityStore } from '../../../application/identity.store';
import { PlanType } from '../../../domain/model/plan.entity';

type AuthMode = 'sign-in' | 'create-account' | 'reset-password';

interface PlanOption {
  type: PlanType;
  name: string;
  price: string;
  description: string;
  features: string[];
}

const PLAN_OPTIONS: PlanOption[] = [
  {
    type: 'BASIC',
    name: 'Basic Plan',
    price: 'S/ 39 / month',
    description: 'For independent farmers',
    features: ['Hasta 3 parcelas', 'Recomendaciones de riego', 'Alertas climaticas basicas'],
  },
  {
    type: 'PRO',
    name: 'Pro Plan',
    price: 'S/ 85 / month',
    description: 'For growing farmers',
    features: ['Hasta 10 parcelas', 'Dashboard', 'Alertas avanzadas', 'Exportacion PDF'],
  },
  {
    type: 'ENTERPRISE',
    name: 'Enterprise Plan',
    price: 'S/ 149 / month',
    description: 'For agricultural SMEs',
    features: ['Parcelas ilimitadas', 'Todo lo del plan Pro', 'Metricas de perdida', 'Soporte prioritario'],
  },
];

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  store = inject(IdentityStore);

  readonly plans = PLAN_OPTIONS;
  readonly mode = computed<AuthMode>(() => this.route.snapshot.data['mode'] as AuthMode);
  readonly selectedPlan = computed<PlanType>(() => (this.route.snapshot.data['plan'] as PlanType | undefined) ?? 'BASIC');
  readonly isEnterprise = computed(() => this.mode() === 'create-account' && this.selectedPlan() === 'ENTERPRISE');

  signInForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  accountForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: [''],
    companyName: [''],
    ruc: [''],
    sector: [''],
  });

  resetForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submitted = false;
  message = '';

  ngOnInit(): void {
    this.store.loadUsers();

    if (this.isEnterprise()) {
      this.accountForm.controls.phone.addValidators(Validators.required);
      this.accountForm.controls.companyName.addValidators(Validators.required);
      this.accountForm.controls.ruc.addValidators(Validators.required);
      this.accountForm.controls.sector.addValidators(Validators.required);
      this.accountForm.controls.email.setValidators([Validators.required, Validators.email]);
    }
  }

  choosePlan(plan: PlanType): void {
    this.router.navigate([this.routeForPlan(plan)]);
  }

  submitSignIn(): void {
    this.submitted = true;
    this.message = '';

    if (this.signInForm.invalid) return;

    const { email, password } = this.signInForm.getRawValue();
    if (this.store.signIn(email, password)) {
      this.router.navigate(['/home']);
      return;
    }

    this.message = 'Correo o contrasena incorrectos.';
  }

  submitCreateAccount(): void {
    this.submitted = true;
    this.message = '';

    if (this.accountForm.invalid) return;

    const form = this.accountForm.getRawValue();
    if (this.isEnterprise()) {
      this.store.registerEnterpriseManager(form.fullName, form.email, form.password, form.companyName);
    } else {
      this.store.registerFarmer(form.fullName, form.email, form.password, this.selectedPlan());
    }

    this.router.navigate(['/home']);
  }

  submitReset(): void {
    this.submitted = true;
    this.message = '';

    if (this.resetForm.invalid) return;

    const { email } = this.resetForm.getRawValue();
    this.message = this.store.recoverPassword(email)
      ? 'Te enviamos instrucciones a tu correo.'
      : 'No encontramos una cuenta con ese correo.';
  }

  routeForPlan(plan: PlanType): string {
    if (plan === 'ENTERPRISE') return '/create-acount-enterprise';
    if (plan === 'PRO') return '/create-acount-pro';
    return '/create-acount-basic';
  }

  fieldInvalid(formName: 'signIn' | 'account' | 'reset', fieldName: string): boolean {
    if (!this.submitted) return false;

    const field = formName === 'signIn'
      ? this.signInForm.get(fieldName)
      : formName === 'reset'
        ? this.resetForm.get(fieldName)
        : this.accountForm.get(fieldName);

    return !!field && field.invalid;
  }
}
