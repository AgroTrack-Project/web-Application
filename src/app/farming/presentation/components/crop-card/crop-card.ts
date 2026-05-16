import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Crop } from '../../../domain/model/crop.entity';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-crop-card',
  imports: [TranslatePipe],
  templateUrl: './crop-card.html',
  styleUrl: './crop-card.css'
})
export class CropCard {
  @Input() crop!: Crop;
  @Output() editCrop = new EventEmitter<Crop>();
  @Output() harvestCrop = new EventEmitter<string>();
  @Output() deleteCrop = new EventEmitter<string>();

  formatDate(date: Date | null): string {
    if (!date) return '—';
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
