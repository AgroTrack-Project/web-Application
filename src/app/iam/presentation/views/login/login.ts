import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SessionStore } from '../../../application/session.store';
import { LanguageSwitcher } from '../../../../shared/presentation/components/language-switcher/language-switcher';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, NgIf, LanguageSwitcher, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private sessionStore = inject(SessionStore);
  private router = inject(Router);

  readonly loading = this.sessionStore.loading;
  readonly error = this.sessionStore.error;

  readonly landingPageUrl = environment.landingPageUrl;

  readonly forgotPasswordMessage = signal<string | null>(null);

  form = {
    email: '',
    password: '',
  };

  constructor() {
    this.sessionStore.clearError();
  }

  async onSubmit(): Promise<void> {
    const ok = await this.sessionStore.signIn(this.form.email, this.form.password);
    if (ok) {
      this.router.navigate(['/home']);
    }
  }

  showForgotPasswordMessage(): void {
    this.forgotPasswordMessage.set('login.forgot_password_message');
  }
}
