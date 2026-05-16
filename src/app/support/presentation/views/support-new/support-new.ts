import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityStore } from '../../../../identity/application/identity.store';
import { SupportStore } from '../../../application/support.store';

@Component({
  selector: 'app-support-new',
  imports: [FormsModule, RouterLink, TranslateModule],
  templateUrl: './support-new.html',
  styleUrl: './support-new.css',
})
export class SupportNew {
  private readonly identityStore = inject(IdentityStore);
  readonly store = inject(SupportStore);
  private readonly router = inject(Router);

  subject = signal('');
  message = signal('');
  submitted = signal(false);
  readonly subjectError = signal(false);
  readonly messageError = signal(false);
  readonly saving = signal(false);

  onSubjectInput(v: string): void { this.subject.set(v); }
  onMessageInput(v: string): void { this.message.set(v); }

  submit(): void {
    this.submitted.set(true);
    const s = this.subject().trim();
    const m = this.message().trim();
    this.subjectError.set(!s);
    this.messageError.set(!m);
    if (!s || !m) return;

    this.saving.set(true);
    this.identityStore.loadUsers();
    this.store.createTicket(
      s,
      m,
      created => {
        this.saving.set(false);
        void this.router.navigate(['/support', created.id]);
      },
      () => this.saving.set(false),
    );
  }
}
