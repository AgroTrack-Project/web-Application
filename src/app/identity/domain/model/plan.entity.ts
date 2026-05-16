export interface Plan {
  id: string;
  getMaxPlots(): number;
  getPrice(): number;
  isDashboardEnabled(): boolean;
  /** Exportación PDF (planes Pro y Enterprise). */
  isExportEnabled(): boolean;
  /** Exportación Excel (solo Enterprise). */
  isExcelExportEnabled(): boolean;
  hasPrioritySupport(): boolean;
}
