import { Plan } from './plan.entity';
import { User } from './user.entity';

export class Farmer extends User {
  private plotIds: string[];

  constructor(id: string, name: string, email: string, password: string, plan: Plan, createdAt: string, updatedAt: string, plotIds: string[] = []) {
    super(id, name, email, password, plan, createdAt, updatedAt);
    this.plotIds = plotIds;
  }

  getPlots(): string[] { return [...this.plotIds]; }

  addPlot(plotId: string): void {
    this.plotIds.push(plotId);
  }

  removePlot(plotId: string): void {
    this.plotIds = this.plotIds.filter(id => id !== plotId);
  }
}
