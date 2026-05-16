import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { IrrigationRecommendation } from '../domain/model/irrigation-recommendation.entity';
import { IrrigationRecommendationResource } from './irrigation-recommendation-response';
import { IrrigationRecommendationAssembler } from './irrigation-recommendation-assembler';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IrrigationRecommendationApiEndpoint extends BaseApiEndpoint<
  IrrigationRecommendation,
  IrrigationRecommendationResource,
  BaseResponse,
  IrrigationRecommendationAssembler
> {
  constructor(http: HttpClient, assembler: IrrigationRecommendationAssembler) {
    super(
      http,
      `${environment.apiBaseUrl}${environment.irrigationRecommendationsEndpointPath}`,
      assembler
    );
  }
}
