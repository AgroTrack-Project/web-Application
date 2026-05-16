export class WaterConsumption {
  constructor(
    readonly plotId: string,
    readonly plotName: string,
    readonly totalLiters: number,
    readonly season: string,
  ) {}
}
