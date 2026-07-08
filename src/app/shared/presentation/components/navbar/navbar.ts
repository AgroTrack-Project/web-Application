import { Component, computed, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { IdentityStore } from '../../../../iam/application/identity.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule, LanguageSwitcher],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  @Input() userName: string = 'Invitado';

  private router = inject(Router);
  private identityStore = inject(IdentityStore);

  readonly currentUserName = computed(() => this.identityStore.currentUser()?.getName() ?? this.userName);
  readonly currentPlan = computed(() => this.identityStore.currentPlanType());

  logout(): void {
    this.identityStore.signOut();
    this.router.navigate(['/sign-in']);
  }
}
