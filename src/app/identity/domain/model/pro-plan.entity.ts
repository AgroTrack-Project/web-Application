import { Plan } from './plan.entity';

export class ProPlan implements Plan {
  readonly id: string;
  private readonly price = 85.00;
  private readonly maxPlots = 10;

  constructor(id = '') { this.id = id; }

  getMaxPlots(): number { return this.maxPlots; }
  getPrice(): number { return this.price; }
  isDashboardEnabled(): boolean { return true; }
  isExportEnabled(): boolean { return true; }
  isExcelExportEnabled(): boolean { return false; }
  hasPrioritySupport(): boolean { return false; }
}
