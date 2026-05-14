import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { AlertPreferenceResource } from './alert-preference-response';
import { AlertPreference } from '../domain/model/alert-preference.entity';

@Injectable({ providedIn: 'root' })
export class AlertPreferenceAssembler implements BaseAssembler<AlertPreference, AlertPreferenceResource, BaseResponse> {

  toEntityFromResource(resource: AlertPreferenceResource): AlertPreference {
    return new AlertPreference(
      resource.id,
      resource.user_id,
      resource.frost_enabled,
      resource.drought_enabled,
      resource.heavy_rain_enabled
    );
  }

  toResourceFromEntity(entity: AlertPreference): AlertPreferenceResource {
    return {
      id: entity.id,
      user_id: entity.getUserId(),
      frost_enabled: entity.isEnabled('FROST'),
      drought_enabled: entity.isEnabled('DROUGHT'),
      heavy_rain_enabled: entity.isEnabled('HEAVY_RAIN'),
    };
  }

  toEntitiesFromResponse(_response: BaseResponse): AlertPreference[] {
    return [];
  }
}
