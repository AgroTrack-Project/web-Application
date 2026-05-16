export class DashboardAccessDeniedError extends Error {
  override readonly name = 'DashboardAccessDeniedError';

  constructor(message = 'Tu plan no incluye acceso al dashboard.') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
