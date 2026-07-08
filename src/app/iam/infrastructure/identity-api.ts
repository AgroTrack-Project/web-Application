import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { UserApiEndpoint } from './user-api-endpoint';
import { PlanApiEndpoint } from './plan-api-endpoint';
import { AlertPreferenceApiEndpoint } from './alert-preference-api-endpoint';

@Injectable({ providedIn: 'root' })
export class IdentityApi extends BaseApi {
  constructor(
    public users: UserApiEndpoint,
    public plans: PlanApiEndpoint,
    public alertPreferences: AlertPreferenceApiEndpoint
  ) {
    super();
  }
}
