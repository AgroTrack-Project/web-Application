export class AlertNotification {

  constructor(
    public title: string,
    public message: string,
    public severity: string,
    public city: string,
    public createdAt: Date
  ) {}
}
