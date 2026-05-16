export class ClimateRiskAnalyzer {

  static calculateRainRisk(
    humidity: number,
    description: string
  ): string {

    const text = description.toLowerCase();

    if (
      text.includes('rain') ||
      text.includes('storm') ||
      text.includes('drizzle') ||
      text.includes('thunderstorm')
    ) {

      return 'High';
    }

    if (humidity >= 85) {

      return 'Medium';
    }

    return 'Low';
  }

  static calculateDroughtRisk(
    humidity: number,
    temperature: number
  ): string {

    if (
      humidity <= 30 &&
      temperature >= 30
    ) {

      return 'High';
    }

    if (
      humidity <= 50 &&
      temperature >= 24
    ) {

      return 'Medium';
    }

    return 'Low';
  }

  static calculateHeatRisk(
    temperature: number,
    minTemperature: number
  ): string {

    if (minTemperature < 5) {

      return 'Cold Alert';
    }

    if (temperature >= 35) {

      return 'High';
    }

    if (temperature >= 28) {

      return 'Medium';
    }

    return 'Low';
  }
}
