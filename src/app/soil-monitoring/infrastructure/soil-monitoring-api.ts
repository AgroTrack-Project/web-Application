import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SoilRecordApiEndpoint } from './soil-record-api-endpoint';
import { IrrigationRecommendationApiEndpoint } from './irrigation-recommendation-api-endpoint';

@Injectable({ providedIn: 'root' })
export class SoilMonitoringApi extends BaseApi {
  constructor(
    public soilRecords: SoilRecordApiEndpoint,
    public irrigationRecommendations: IrrigationRecommendationApiEndpoint
  ) {
    super();
  }
}
