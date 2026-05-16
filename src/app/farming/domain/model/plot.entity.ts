import { PlotStatus } from './plot-status.enum';

export class Plot {
  readonly id: string;
  private name: string;
  private location: string;
  private sizeHectares: number;
  private status: PlotStatus;
  private userId: string;
  private readonly createdAt: Date;

  constructor(
    id: string,
    name: string,
    location: string,
    sizeHectares: number,
    status: PlotStatus,
    userId: string,
    createdAt: string
  ) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.sizeHectares = sizeHectares;
    this.status = status;
    this.userId = userId;
    this.createdAt = new Date(createdAt);
  }

  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getLocation(): string { return this.location; }
  getSizeHectares(): number { return this.sizeHectares; }
  getStatus(): PlotStatus { return this.status; }
  getUserId(): string { return this.userId; }
  getCreatedAt(): Date { return this.createdAt; }

  register(): void {
    this.status = PlotStatus.ACTIVE;
  }

  update(name: string, location: string, sizeHectares: number): void {
    this.name = name;
    this.location = location;
    this.sizeHectares = sizeHectares;
  }

  delete(): void {
    this.status = PlotStatus.DELETED;
  }

  setStatus(status: PlotStatus): void {
    this.status = status;
  }
}
