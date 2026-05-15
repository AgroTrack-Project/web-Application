import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Plot } from '../../../domain/model/plot.entity';

@Component({
  selector: 'app-plot-card',
  imports: [],
  templateUrl: './plot-card.html',
  styleUrl: './plot-card.css'
})
export class PlotCard {
  @Input() plot!: Plot;
  @Input() cropCount = 0;
  @Output() viewDetail = new EventEmitter<Plot>();
  @Output() editPlot = new EventEmitter<Plot>();
  @Output() deletePlot = new EventEmitter<string>();
}
