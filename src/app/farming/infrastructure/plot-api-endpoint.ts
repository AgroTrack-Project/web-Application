import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { PlotResource } from './plot-response';
import { PlotAssembler } from './plot-assembler';
import { Plot } from '../domain/model/plot.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlotApiEndpoint extends BaseApiEndpoint<Plot, PlotResource, BaseResponse, PlotAssembler> {
  constructor(http: HttpClient, assembler: PlotAssembler) {
    super(http, `${environment.apiBaseUrl}${environment.plotsEndpointPath}`, assembler);
  }
}
