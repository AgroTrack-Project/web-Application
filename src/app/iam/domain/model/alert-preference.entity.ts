export type AlertType = 'FROST' | 'DROUGHT' | 'HEAVY_RAIN';

export class AlertPreference {
  readonly id: string;
  private userId: string;
  private frostEnabled: boolean;
  private droughtEnabled: boolean;
  private heavyRainEnabled: boolean;

  constructor(id: string, userId: string, frostEnabled = false, droughtEnabled = false, heavyRainEnabled = false) {
    this.id = id;
    this.userId = userId;
    this.frostEnabled = frostEnabled;
    this.droughtEnabled = droughtEnabled;
    this.heavyRainEnabled = heavyRainEnabled;
  }

  update(frost: boolean, drought: boolean, rain: boolean): void {
    this.frostEnabled = frost;
    this.droughtEnabled = drought;
    this.heavyRainEnabled = rain;
  }

  isEnabled(type: AlertType): boolean {
    const map: Record<AlertType, boolean> = {
      FROST: this.frostEnabled,
      DROUGHT: this.droughtEnabled,
      HEAVY_RAIN: this.heavyRainEnabled,
    };
    return map[type];
  }

  getUserId(): string { return this.userId; }
}
