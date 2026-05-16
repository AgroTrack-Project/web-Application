import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { shouldPlayAppEntryAnimation } from '../../services/app-entry-animation';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, RouterOutlet, SidebarComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit, AfterViewInit {
  private readonly router = inject(Router);

  /** true = preparar animación; false = mostrar UI sin transición */
  protected readonly entryPending = signal(false);
  /** true = keyframes en curso */
  protected readonly entryActive = signal(false);

  ngOnInit(): void {
    if (shouldPlayAppEntryAnimation()) {
      this.entryPending.set(true);
      this.stripLandingQueryParams();
    } else {
      this.entryActive.set(true);
    }
  }

  ngAfterViewInit(): void {
    if (!this.entryPending()) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.entryActive.set(true));
    });
  }

  private stripLandingQueryParams(): void {
    const tree = this.router.parseUrl(this.router.url);
    const { from, entry, ...rest } = tree.queryParams;
    if (from === undefined && entry === undefined) return;
    tree.queryParams = rest;
    void this.router.navigateByUrl(tree, { replaceUrl: true });
  }
}
