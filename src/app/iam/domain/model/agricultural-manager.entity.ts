import { Plan } from './plan.entity';
import { User } from './user.entity';

export class AgriculturalManager extends User {
  private companyName: string;
  private plotIds: string[];

  constructor(id: string, name: string, email: string, password: string, plan: Plan, createdAt: string, updatedAt: string, companyName: string, plotIds: string[] = []) {
    super(id, name, email, password, plan, createdAt, updatedAt);
    this.companyName = companyName;
    this.plotIds = plotIds;
  }

  getCompanyName(): string { return this.companyName; }
  getPlots(): string[] { return [...this.plotIds]; }
}
