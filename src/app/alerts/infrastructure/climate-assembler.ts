import { AlertNotification } from '../domain/model/alerts-notification.entity';
import { AlertResource } from './climate-response';

export class ClimateAssembler {

  static toNotification(resource: AlertResource): AlertNotification {
    return new AlertNotification(
      resource.title,
      resource.description,
      resource.urgency,
      resource.city,
      new Date(resource.generated_at)
    );
  }
}
