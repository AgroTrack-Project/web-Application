import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
  @Input() name = '';
  @Input() size: 'sm' | 'lg' = 'sm';

  get initials(): string {
    const parts = this.name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
}
