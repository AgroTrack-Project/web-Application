import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { PlanResource } from './plan-response';
import { PlanAssembler } from './plan-assembler';
import { Plan } from '../domain/model/plan.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlanApiEndpoint extends BaseApiEndpoint<Plan, PlanResource, BaseResponse, PlanAssembler> {
  constructor(http: HttpClient, assembler: PlanAssembler) {
    super(http, `${environment.apiBaseUrl}${environment.plansEndpointPath}`, assembler);
  }
}
