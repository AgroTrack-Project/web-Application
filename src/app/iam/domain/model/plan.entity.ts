export type PlanType = 'BASIC' | 'PRO' | 'ENTERPRISE';

export interface Plan {
  id: string;
  getMaxPlots(): number;
  getPrice(): number;
  isDashboardEnabled(): boolean;
  isExportEnabled(): boolean;
  hasPrioritySupport(): boolean;
}
