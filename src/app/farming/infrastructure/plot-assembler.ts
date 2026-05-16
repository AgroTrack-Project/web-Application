import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { PlotResource } from './plot-response';
import { Plot } from '../domain/model/plot.entity';
import { PlotStatus } from '../domain/model/plot-status.enum';

@Injectable({ providedIn: 'root' })
export class PlotAssembler implements BaseAssembler<Plot, PlotResource, BaseResponse> {

  toEntityFromResource(resource: PlotResource): Plot {
    return new Plot(
      resource.id,
      resource.name,
      resource.location,
      resource.size_hectares,
      resource.status as PlotStatus,
      resource.user_id,
      resource.created_at
    );
  }

  toResourceFromEntity(entity: Plot): PlotResource {
    return {
      id: entity.getId(),
      name: entity.getName(),
      location: entity.getLocation(),
      size_hectares: entity.getSizeHectares(),
      status: entity.getStatus(),
      user_id: entity.getUserId(),
      created_at: entity.getCreatedAt().toISOString()
    };
  }

  toEntitiesFromResponse(_response: BaseResponse): Plot[] {
    return [];
  }
}
