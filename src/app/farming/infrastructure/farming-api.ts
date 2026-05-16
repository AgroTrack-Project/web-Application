import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { PlotApiEndpoint } from './plot-api-endpoint';
import { CropApiEndpoint } from './crop-api-endpoint';

@Injectable({ providedIn: 'root' })
export class FarmingApi extends BaseApi {
  constructor(
    public plots: PlotApiEndpoint,
    public crops: CropApiEndpoint
  ) {
    super();
  }
}
