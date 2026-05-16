import { TicketStatus } from './ticket-status.enum';

export class SupportTicket {
  readonly id: string;
  readonly userId: string;
  private subject: string;
  private message: string;
  private status: TicketStatus;
  readonly createdAt: Date;
  private respondedAt: Date | null;

  constructor(
    id: string,
    userId: string,
    subject: string,
    message: string,
    status: TicketStatus,
    createdAt: Date,
    respondedAt: Date | null = null,
  ) {
    this.id = id;
    this.userId = userId;
    this.subject = subject;
    this.message = message;
    this.status = status;
    this.createdAt = createdAt;
    this.respondedAt = respondedAt;
  }

  getSubject(): string {
    return this.subject;
  }

  getMessage(): string {
    return this.message;
  }

  getStatus(): TicketStatus {
    return this.status;
  }

  getRespondedAt(): Date | null {
    return this.respondedAt;
  }

  close(): void {
    this.status = TicketStatus.CLOSED;
    this.respondedAt = new Date();
  }
}
