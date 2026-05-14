export interface Plan {
  id: string;
  getMaxPlots(): number;
  getPrice(): number;
  isDashboardEnabled(): boolean;
  isExportEnabled(): boolean;
  hasPrioritySupport(): boolean;
}
