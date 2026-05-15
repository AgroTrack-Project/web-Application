import { SoilStatus } from './soil-status.enum';

export class SoilRecord {
  readonly id: string;
  private plotId: string;
  private humidity: number;
  private temperature: number;
  private readonly recordedAt: Date;

  constructor(
    id: string,
    plotId: string,
    humidity: number,
    temperature: number,
    recordedAt: string
  ) {
    this.id = id;
    this.plotId = plotId;
    this.humidity = humidity;
    this.temperature = temperature;
    this.recordedAt = new Date(recordedAt);
  }

  getId(): string { return this.id; }
  getPlotId(): string { return this.plotId; }
  getHumidity(): number { return this.humidity; }
  getTemperature(): number { return this.temperature; }
  getRecordedAt(): Date { return this.recordedAt; }

  getStatus(): SoilStatus {
    if (this.humidity < 40) return SoilStatus.DRY;
    if (this.humidity <= 70) return SoilStatus.OPTIMAL;
    return SoilStatus.WET;
  }
}
