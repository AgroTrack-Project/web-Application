import { Plan } from './plan.entity';

export class BasicPlan implements Plan {
  readonly id: string;
  private readonly price = 39.00;
  private readonly maxPlots = 3;

  constructor(id = '') { this.id = id; }

  getMaxPlots(): number { return this.maxPlots; }
  getPrice(): number { return this.price; }
  isDashboardEnabled(): boolean { return false; }
  isExportEnabled(): boolean { return false; }
  hasPrioritySupport(): boolean { return false; }
}
