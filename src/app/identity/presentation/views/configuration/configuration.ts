import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityStore } from '../../../application/identity.store';
import { AlertPreference } from '../../../domain/model/alert-preference.entity';

@Component({
  selector: 'app-configuration',
  imports: [TranslateModule],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css'
})
export class Configuration implements OnInit {
  store = inject(IdentityStore);

  ngOnInit(): void {
    this.store.loadAlertPreferences();
  }

  toggle(type: 'FROST' | 'DROUGHT' | 'HEAVY_RAIN'): void {
    const pref = this.store.currentAlertPreference();
    if (!pref) return;
    const updated = new AlertPreference(
      pref.id,
      pref.getUserId(),
      type === 'FROST'      ? !pref.isEnabled('FROST')      : pref.isEnabled('FROST'),
      type === 'DROUGHT'    ? !pref.isEnabled('DROUGHT')    : pref.isEnabled('DROUGHT'),
      type === 'HEAVY_RAIN' ? !pref.isEnabled('HEAVY_RAIN') : pref.isEnabled('HEAVY_RAIN'),
    );
    this.store.updateAlertPreference(updated);
  }
}
