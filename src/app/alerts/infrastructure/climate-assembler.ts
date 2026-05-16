import { ClimateEntity } from '../domain/model/climate.entity';

import { ClimateResponse } from './climate-response';

import { ClimateRiskAnalyzer } from '../domain/service/climate-risk-analyzer';

export class ClimateAssembler {

  static toEntity(
    response: ClimateResponse
  ): ClimateEntity {

    const description = response.weather[0].description;

    const humidity = response.main.humidity;

    const temperature = response.main.temp;

    return new ClimateEntity(

      response.name,

      response.sys.country,

      temperature,

      humidity,

      description,

      response.weather[0].icon,

      response.wind.speed,

      ClimateRiskAnalyzer.calculateRainRisk(
        humidity,
        description
      ),

      ClimateRiskAnalyzer.calculateDroughtRisk(
        humidity,
        temperature
      ),

      ClimateRiskAnalyzer.calculateHeatRisk(
        temperature,
        response.main.temp_min
      )
    );
  }
}
