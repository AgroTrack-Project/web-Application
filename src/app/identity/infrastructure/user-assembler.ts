import { Injectable } from '@angular/core';
import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {BaseResponse} from '../../shared/infrastructure/base-response';
import { UserResource } from './user-response';
import { User } from '../domain/model/user.entity';
import { Farmer } from '../domain/model/farmer.entity';
import { AgriculturalManager } from '../domain/model/agricultural-manager.entity';
import { BasicPlan } from '../domain/model/basic-plan.entity';
import { ProPlan } from '../domain/model/pro-plan.entity';
import { EnterprisePlan } from '../domain/model/enterprise-plan.entity';
import { Plan } from '../domain/model/plan.entity';

@Injectable({ providedIn: 'root' })
export class UserAssembler implements BaseAssembler<User, UserResource, BaseResponse> {

  toEntityFromResource(resource: UserResource): User {
    const plan = this.resolvePlan(resource.plan_type);
    if (resource.user_type === 'farmer') {
      return new Farmer(resource.id, resource.name, resource.email, resource.password, plan, resource.created_at, resource.updated_at);
    }
    return new AgriculturalManager(
      resource.id,
      resource.name,
      resource.email,
      resource.password,
      plan,
      resource.company_name ?? '',
      resource.created_at,
      resource.updated_at
    );
  }

  toResourceFromEntity(entity: User): UserResource {
    const isManager = entity instanceof AgriculturalManager;
    const now = new Date().toISOString();
    return {
      id: entity.getId(),
      name: entity.getName(),
      email: entity.getEmail(),
      password: entity.getPassword(),
      user_type: isManager ? 'agricultural_manager' : 'farmer',
      plan_type: this.resolvePlanType(entity.getPlan()),
      company_name: isManager ? (entity as AgriculturalManager).getCompanyName() : undefined,
      created_at: now,
      updated_at: now,
    };
  }

  toEntitiesFromResponse(_response: BaseResponse): User[] {
    return [];
  }

  private resolvePlan(type: string): Plan {
    if (type === 'PRO') return new ProPlan();
    if (type === 'ENTERPRISE') return new EnterprisePlan();
    return new BasicPlan();
  }

  private resolvePlanType(plan: Plan): 'BASIC' | 'PRO' | 'ENTERPRISE' {
    if (plan instanceof ProPlan) return 'PRO';
    if (plan instanceof EnterprisePlan) return 'ENTERPRISE';
    return 'BASIC';
  }
}
