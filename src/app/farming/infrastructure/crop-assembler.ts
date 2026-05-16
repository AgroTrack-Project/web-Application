import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { CropResource } from './crop-response';
import { Crop } from '../domain/model/crop.entity';
import { CropStatus } from '../domain/model/crop-status.enum';

@Injectable({ providedIn: 'root' })
export class CropAssembler implements BaseAssembler<Crop, CropResource, BaseResponse> {

  toEntityFromResource(resource: CropResource): Crop {
    return new Crop(
      resource.id,
      resource.type,
      resource.sowing_date,
      resource.harvest_date,
      resource.status as CropStatus,
      resource.plot_id
    );
  }

  toResourceFromEntity(entity: Crop): CropResource {
    const harvestDate = entity.getHarvestDate();
    return {
      id: entity.getId(),
      type: entity.getType(),
      sowing_date: entity.getSowingDate().toISOString(),
      harvest_date: harvestDate ? harvestDate.toISOString() : '',
      status: entity.getStatus(),
      plot_id: entity.getPlotId()
    };
  }

  toEntitiesFromResponse(_response: BaseResponse): Crop[] {
    return [];
  }
}
