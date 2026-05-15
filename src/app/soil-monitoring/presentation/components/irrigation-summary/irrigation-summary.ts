import { Component, Input, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SoilMonitoringStore } from '../../../application/soil-monitoring.store';

interface SuggestedIrrigation {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-irrigation-summary',
  imports: [TranslateModule, DatePipe],
  templateUrl: './irrigation-summary.html',
  styleUrl: './irrigation-summary.css'
})
export class IrrigationSummary {
  @Input() plotId = '';
  @Input() sowingDate: string | null = null;

  soilStore = inject(SoilMonitoringStore);

  suggestedIrrigations(): SuggestedIrrigation[] {
    const baseDate = this.getBaseDate();

    return [2, 4, 6].map((daysToAdd, index) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + daysToAdd);
      date.setHours(6, 0, 0, 0);

      return {
        id: index + 1,
        date,
        startTime: '06:00',
        endTime: '07:00'
      };
    });
  }

  private getBaseDate(): Date {
    if (!this.sowingDate) {
      return new Date();
    }

    const parsedDate = new Date(this.sowingDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return new Date();
    }

    return parsedDate;
  }

  irrigationHistory() {
    return this.soilStore.getIrrigationHistoryForPlot(this.plotId);
  }

  statusKey(recommendation: any): string {
    return this.soilStore.getIrrigationStatusTranslationKey(recommendation);
  }

  statusClass(recommendation: any): string {
    return this.soilStore.getIrrigationStatusClass(recommendation);
  }
}
