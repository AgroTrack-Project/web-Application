import { Component, Input, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SoilMonitoringStore } from '../../../application/soil-monitoring.store';
import { SoilRecord } from '../../../domain/model/soil-record.entity';

@Component({
  selector: 'app-soil-record-summary',
  imports: [TranslateModule, DatePipe, ReactiveFormsModule],
  templateUrl: './soil-record-summary.html',
  styleUrl: './soil-record-summary.css'
})
export class SoilRecordSummary {
  @Input() plotId = '';

  private fb = inject(FormBuilder);
  soilStore = inject(SoilMonitoringStore);

  submitted = false;

  soilForm = this.fb.group({
    humidity: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(100)]),
    temperature: this.fb.control<number | null>(null, [Validators.required])
  });

  records() {
    return this.soilStore.getRecordsForPlot(this.plotId);
  }

  latestRecord() {
    return this.soilStore.getLatestRecordForPlot(this.plotId);
  }

  statusTranslationKey(): string {
    return this.soilStore.getStatusTranslationKeyForPlot(this.plotId);
  }

  isHumidityInvalid(): boolean {
    const field = this.soilForm.controls.humidity;
    return this.submitted && field.invalid;
  }

  isTemperatureInvalid(): boolean {
    const field = this.soilForm.controls.temperature;
    return this.submitted && field.invalid;
  }

  registerSoilRecord(): void {
    this.submitted = true;

    if (this.soilForm.invalid || !this.plotId) {
      return;
    }

    const formValue = this.soilForm.getRawValue();

    const soilRecord = new SoilRecord(
      crypto.randomUUID(),
      this.plotId,
      Number(formValue.humidity),
      Number(formValue.temperature),
      new Date().toISOString()
    );

    this.soilStore.createSoilRecord(soilRecord);

    this.soilForm.reset({
      humidity: null,
      temperature: null
    });

    this.submitted = false;
  }
}
