import { CropStatus } from './crop-status.enum';

export class Crop {
  readonly id: string;
  private type: string;
  private sowingDate: Date;
  private harvestDate: Date | null;
  private status: CropStatus;
  private plotId: string;

  constructor(
    id: string,
    type: string,
    sowingDate: string,
    harvestDate: string,
    status: CropStatus,
    plotId: string
  ) {
    this.id = id;
    this.type = type;
    this.sowingDate = new Date(sowingDate);
    this.harvestDate = harvestDate ? new Date(harvestDate) : null;
    this.status = status;
    this.plotId = plotId;
  }

  getId(): string { return this.id; }
  getType(): string { return this.type; }
  getSowingDate(): Date { return this.sowingDate; }
  getHarvestDate(): Date | null { return this.harvestDate; }
  getStatus(): CropStatus { return this.status; }
  getPlotId(): string { return this.plotId; }

  register(): void { this.status = CropStatus.ACTIVE; }

  update(type: string, sowingDate: string, harvestDate: string): void {
    this.type = type;
    this.sowingDate = new Date(sowingDate);
    this.harvestDate = harvestDate ? new Date(harvestDate) : null;
  }

  markAsHarvested(harvestDate: string): void {
    this.harvestDate = new Date(harvestDate);
    this.status = CropStatus.HARVESTED;
  }

  isActive(): boolean { return this.status === CropStatus.ACTIVE; }

  setStatus(status: CropStatus): void { this.status = status; }
}
