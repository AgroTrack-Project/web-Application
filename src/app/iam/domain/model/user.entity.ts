import { Plan } from './plan.entity';

export abstract class User {
  readonly id: string;
  protected name: string;
  private email: string;
  private password: string;
  protected plan: Plan;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(id: string, name: string, email: string, password: string, plan: Plan, createdAt: string, updatedAt: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.plan = plan;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
  }

  updateProfile(name: string, email: string): void {
    this.name = name;
    this.email = email;
    this.updatedAt = new Date();
  }

  changePlan(plan: Plan): void {
    this.plan = plan;
    this.updatedAt = new Date();
  }

  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
  getPassword(): string { return this.password; }
  getPlan(): Plan { return this.plan; }
}
