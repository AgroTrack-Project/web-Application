import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { SupportTicketResource } from './support-ticket-response';
import { SupportTicket } from '../domain/model/support-ticket.entity';
import { TicketStatus } from '../domain/model/ticket-status.enum';

@Injectable({ providedIn: 'root' })
export class SupportTicketAssembler implements BaseAssembler<SupportTicket, SupportTicketResource, BaseResponse> {
  toEntityFromResource(resource: SupportTicketResource): SupportTicket {
    return new SupportTicket(
      resource.id,
      resource.user_id,
      resource.subject,
      resource.message,
      this.parseStatus(resource.status),
      new Date(resource.created_at),
      resource.responded_at ? new Date(resource.responded_at) : null,
    );
  }

  toResourceFromEntity(entity: SupportTicket): SupportTicketResource {
    return {
      id: entity.id,
      user_id: entity.userId,
      subject: entity.getSubject(),
      message: entity.getMessage(),
      status: entity.getStatus(),
      created_at: entity.createdAt.toISOString(),
      responded_at: entity.getRespondedAt()?.toISOString() ?? null,
    };
  }

  toEntitiesFromResponse(_response: BaseResponse): SupportTicket[] {
    return [];
  }

  private parseStatus(value: string): TicketStatus {
    const v = (value ?? '').toString().trim().toUpperCase();
    if (v === TicketStatus.IN_PROGRESS) return TicketStatus.IN_PROGRESS;
    if (v === TicketStatus.CLOSED) return TicketStatus.CLOSED;
    return TicketStatus.OPEN;
  }
}
