export class LossSummary {
  constructor(
    readonly plotId: string,
    readonly plotName: string,
    readonly lossPercentage: number,
    readonly cause: string,
    readonly season: string,
  ) {}
}
