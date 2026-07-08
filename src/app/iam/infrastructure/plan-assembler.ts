import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { PlanResource } from './plan-response';
import { Plan } from '../domain/model/plan.entity';
import { BasicPlan } from '../domain/model/basic-plan.entity';
import { ProPlan } from '../domain/model/pro-plan.entity';
import { EnterprisePlan } from '../domain/model/enterprise-plan.entity';

@Injectable({ providedIn: 'root' })
export class PlanAssembler implements BaseAssembler<Plan, PlanResource, BaseResponse> {

  toEntityFromResource(resource: PlanResource): Plan {
    if (resource.plan_type === 'PRO') return new ProPlan(resource.id);
    if (resource.plan_type === 'ENTERPRISE') return new EnterprisePlan(resource.id);
    return new BasicPlan(resource.id);
  }

  toResourceFromEntity(entity: Plan): PlanResource {
    const plan_type = entity instanceof ProPlan ? 'PRO' : entity instanceof EnterprisePlan ? 'ENTERPRISE' : 'BASIC';
    return {
      id: entity.id,
      plan_type,
      price: entity.getPrice(),
      max_plots: entity.getMaxPlots(),
      is_dashboard_enabled: entity.isDashboardEnabled(),
      is_export_enabled: entity.isExportEnabled(),
      has_priority_support: entity.hasPrioritySupport(),
    };
  }

  toEntitiesFromResponse(_response: BaseResponse): Plan[] {
    return [];
  }
}
