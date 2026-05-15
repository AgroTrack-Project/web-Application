import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SoilRecordApiEndpoint } from './soil-record-api-endpoint';

@Injectable({ providedIn: 'root' })
export class SoilMonitoringApi extends BaseApi {
  constructor(
    public soilRecords: SoilRecordApiEndpoint
  ) {
    super();
  }
}
