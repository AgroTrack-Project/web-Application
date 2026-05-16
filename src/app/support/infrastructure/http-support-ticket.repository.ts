import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupportTicketRepository } from '../domain/repository/support-ticket.repository';
import { SupportTicket } from '../domain/model/support-ticket.entity';
import { SupportTicketResource } from './support-ticket-response';
import { SupportTicketAssembler } from './support-ticket-assembler';

@Injectable({ providedIn: 'root' })
export class HttpSupportTicketRepository extends SupportTicketRepository {
  private readonly url = `${environment.apiBaseUrl}${environment.supportTicketsEndpointPath}`;

  constructor(
    private readonly http: HttpClient,
    private readonly assembler: SupportTicketAssembler,
  ) {
    super();
  }

  findByUserId(userId: string): Observable<SupportTicket[]> {
    return this.http.get<SupportTicketResource[]>(this.url).pipe(
      map(rows =>
        rows
          .filter(r => r.user_id === userId)
          .map(r => this.assembler.toEntityFromResource(r))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      ),
    );
  }

  findById(id: string): Observable<SupportTicket | undefined> {
    return this.http.get<SupportTicketResource>(`${this.url}/${id}`).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
    );
  }

  save(ticket: SupportTicket): Observable<SupportTicket> {
    const resource = this.assembler.toResourceFromEntity(ticket);
    if (ticket.id) {
      return this.http.put<SupportTicketResource>(`${this.url}/${ticket.id}`, resource).pipe(
        map(r => this.assembler.toEntityFromResource(r)),
      );
    }
    const { id: _id, ...body } = resource;
    return this.http.post<SupportTicketResource>(this.url, body).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
    );
  }
}
