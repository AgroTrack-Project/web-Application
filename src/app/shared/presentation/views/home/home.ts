import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FarmingStore } from '../../../../farming/application/farming.store';
import { IdentityStore } from '../../../../identity/application/identity.store';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private farmingStore = inject(FarmingStore);
  private identityStore = inject(IdentityStore);
  private router = inject(Router);

  readonly username = computed(() => this.identityStore.currentUser()?.getName() ?? '');
  readonly plots = computed(() => this.farmingStore.userPlots());
  readonly plotCount = computed(() => this.farmingStore.userPlots().length);

  ngOnInit(): void {
    this.farmingStore.loadPlots();
    this.farmingStore.loadCrops();
    this.identityStore.loadUsers();
  }

  getFirstCropType(plotId: string): string {
    const crops = this.farmingStore.getCropsForPlot(plotId);
    const active = crops.find(c => c.isActive());
    return active?.getType() ?? '—';
  }

  goToNewPlot(): void {
    this.router.navigate(['/parcelas/nueva']);
  }
}
