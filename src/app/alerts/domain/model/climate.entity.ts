/**
 * Entity that represents
 * climate information obtained
 * from the external weather API.
 */
export class ClimateEntity {

  constructor(
    public city: string,
    public country: string,
    public temperature: number,
    public humidity: number,
    public description: string,
    public icon: string,
    public windSpeed: number,
    public rainRisk: string,
    public droughtRisk: string,
    public heatRisk: string,
  ) {}
}
