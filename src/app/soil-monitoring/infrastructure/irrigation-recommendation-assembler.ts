import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { IrrigationRecommendation } from '../domain/model/irrigation-recommendation.entity';
import { IrrigationRecommendationStatus } from '../domain/model/irrigation-recommendation-status.enum';
import { IrrigationRecommendationResource } from './irrigation-recommendation-response';

@Injectable({ providedIn: 'root' })
export class IrrigationRecommendationAssembler implements BaseAssembler<
  IrrigationRecommendation,
  IrrigationRecommendationResource,
  BaseResponse
> {

  toEntityFromResource(resource: IrrigationRecommendationResource): IrrigationRecommendation {
    return new IrrigationRecommendation(
      resource.id,
      resource.plot_id,
      resource.soil_record_id,
      resource.message,
      resource.urgency,
      resource.status as IrrigationRecommendationStatus,
      resource.generated_at,
      resource.responded_at
    );
  }

  toResourceFromEntity(entity: IrrigationRecommendation): IrrigationRecommendationResource {
    return {
      id: entity.getId(),
      plot_id: entity.getPlotId(),
      soil_record_id: entity.getSoilRecordId(),
      message: entity.getMessage(),
      urgency: entity.getUrgency(),
      status: entity.getStatus(),
      generated_at: entity.getGeneratedAt().toISOString(),
      responded_at: entity.getRespondedAt()?.toISOString() ?? null
    };
  }

  toEntitiesFromResponse(_response: BaseResponse): IrrigationRecommendation[] {
    return [];
  }
}
