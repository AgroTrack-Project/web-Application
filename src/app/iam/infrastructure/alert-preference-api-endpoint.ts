import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { AlertPreferenceResource } from './alert-preference-response';
import { AlertPreferenceAssembler } from './alert-preference-assembler';
import { AlertPreference } from '../domain/model/alert-preference.entity';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AlertPreferenceApiEndpoint extends BaseApiEndpoint<AlertPreference, AlertPreferenceResource, BaseResponse, AlertPreferenceAssembler> {
  constructor(http: HttpClient, assembler: AlertPreferenceAssembler) {
    super(http, `${environment.apiBaseUrl}${environment.alertPreferencesEndpointPath}`, assembler);
  }
}
