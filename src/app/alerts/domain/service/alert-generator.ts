import { ClimateEntity } from '../model/climate.entity';
import { AlertNotification } from '../model/alerts-notification.entity';

export class AlertGenerator {

  static generateAlerts(
    climate: ClimateEntity
  ): AlertNotification[] {

    const alerts: AlertNotification[] = [];

    if (climate.rainRisk === 'High') {

      alerts.push(
        new AlertNotification(
          'Heavy Rain Risk',
          'Possible heavy rain or storms detected.',
          'HIGH',
          climate.city,
          new Date()
        )
      );
    }

    if (climate.droughtRisk === 'High') {

      alerts.push(
        new AlertNotification(
          'Drought Risk',
          'Low humidity and high temperatures detected.',
          'HIGH',
          climate.city,
          new Date()
        )
      );
    }

    if (climate.heatRisk === 'High') {

      alerts.push(
        new AlertNotification(
          'Extreme Heat',
          'Very high temperatures detected.',
          'HIGH',
          climate.city,
          new Date()
        )
      );
    }

    if (climate.heatRisk === 'Medium') {

      alerts.push(
        new AlertNotification(
          'Moderate Heat',
          'Warm temperatures detected.',
          'MEDIUM',
          climate.city,
          new Date()
        )
      );
    }

    if (climate.heatRisk === 'Cold Alert') {

      alerts.push(
        new AlertNotification(
          'Cold Alert',
          'Very low temperatures detected. Protect your crops from frost.',
          'HIGH',
          climate.city,
          new Date()
        )
      );
    }

    return alerts;
  }
}
