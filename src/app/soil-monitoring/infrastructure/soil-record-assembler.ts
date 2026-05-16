import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { SoilRecord } from '../domain/model/soil-record.entity';
import { SoilRecordResource } from './soil-record-response';

@Injectable({ providedIn: 'root' })
export class SoilRecordAssembler implements BaseAssembler<SoilRecord, SoilRecordResource, BaseResponse> {

  toEntityFromResource(resource: SoilRecordResource): SoilRecord {
    return new SoilRecord(
      resource.id,
      resource.plot_id,
      resource.humidity,
      resource.temperature,
      resource.recorded_at
    );
  }

  toResourceFromEntity(entity: SoilRecord): SoilRecordResource {
    return {
      id: entity.getId(),
      plot_id: entity.getPlotId(),
      humidity: entity.getHumidity(),
      temperature: entity.getTemperature(),
      recorded_at: entity.getRecordedAt().toISOString()
    };
  }

  toEntitiesFromResponse(_response: BaseResponse): SoilRecord[] {
    return [];
  }
}
