import { IrrigationRecommendationStatus } from './irrigation-recommendation-status.enum';

export class IrrigationRecommendation {
  readonly id: string;
  private plotId: string;
  private soilRecordId: string;
  private message: string;
  private urgency: string;
  private status: IrrigationRecommendationStatus;
  private generatedAt: Date;
  private respondedAt: Date | null;

  constructor(
    id: string,
    plotId: string,
    soilRecordId: string,
    message: string,
    urgency: string,
    status: IrrigationRecommendationStatus,
    generatedAt: string,
    respondedAt: string | null
  ) {
    this.id = id;
    this.plotId = plotId;
    this.soilRecordId = soilRecordId;
    this.message = message;
    this.urgency = urgency;
    this.status = status;
    this.generatedAt = new Date(generatedAt);
    this.respondedAt = respondedAt ? new Date(respondedAt) : null;
  }

  getId(): string { return this.id; }
  getPlotId(): string { return this.plotId; }
  getSoilRecordId(): string { return this.soilRecordId; }
  getMessage(): string { return this.message; }
  getUrgency(): string { return this.urgency; }
  getStatus(): IrrigationRecommendationStatus { return this.status; }
  getGeneratedAt(): Date { return this.generatedAt; }
  getRespondedAt(): Date | null { return this.respondedAt; }

  confirm(): void {
    this.status = IrrigationRecommendationStatus.CONFIRMED;
    this.respondedAt = new Date();
  }

  reject(): void {
    this.status = IrrigationRecommendationStatus.REJECTED;
    this.respondedAt = new Date();
  }
}
