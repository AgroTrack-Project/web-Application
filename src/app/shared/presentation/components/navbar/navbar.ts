import { Component, Input, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { Avatar } from '../avatar/avatar';
import { SessionStore } from '../../../../iam/application/session.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule, LanguageSwitcher, Avatar],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  @Input() userName: string = 'Invitado';

  private sessionStore = inject(SessionStore);
  private router = inject(Router);

  readonly currentUserName = computed(() => this.sessionStore.currentUser()?.name ?? this.userName);
  readonly currentPlan = computed(() => this.sessionStore.currentUser()?.planType ?? '');

  logout(): void {
    this.sessionStore.signOut();
    this.router.navigate(['/login']);
  }
}
