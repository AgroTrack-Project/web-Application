import { Plan } from './plan.entity';

export class EnterprisePlan implements Plan {
  readonly id: string;
  private readonly price = 149.00;
  private readonly maxPlots = Infinity;

  constructor(id = '') { this.id = id; }

  getMaxPlots(): number { return this.maxPlots; }
  getPrice(): number { return this.price; }
  isDashboardEnabled(): boolean { return true; }
  isExportEnabled(): boolean { return true; }
  hasPrioritySupport(): boolean { return true; }
}
