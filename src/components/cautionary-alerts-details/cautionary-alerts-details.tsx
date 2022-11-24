import React from "react";

import { locale } from "../../services";

import { Alert } from "@mtfh/common/lib/api/discretionary-alerts/v1/types";
import { Alert as AlertIcon, Heading, Link, Text } from "@mtfh/common/lib/components";

import "./cautionary-alerts.styles.scss";

const { cautionaryAlerts } = locale;

export const CautionaryAlertsDetails = ({ alerts }: { alerts: Alert[] }): JSX.Element => {
  const alertsPerPerson: Record<
    string,
    {
      personName: string;
      alerts: string[];
    }
  > = {};

  alerts.forEach((alert) => {
    if (alertsPerPerson[alert.personId]) {
      alertsPerPerson[alert.personId].alerts.push(alert.description);
    } else {
      alertsPerPerson[alert.personId] = {
        personName: alert.personName,
        alerts: [alert.description],
      };
    }
  });

  return (
    <aside className="mtfh-cautionary-alerts">
      <Heading variant="h2" className="lbh-heading lbh-heading-h3">
        {alerts.length > 0 && (
          <AlertIcon
            data-testid="alert-icon"
            viewBox="0 0 37 58"
            width="16"
            height="26"
            style={{ marginRight: 4 }}
          />
        )}
        {cautionaryAlerts.cautionaryAlerts}
      </Heading>

      {alerts.length > 0 ? (
        Object.keys(alertsPerPerson).map((personId) => {
          const { personName, alerts } = alertsPerPerson[personId];
          return (
            <Text size="sm" key={personId}>
              <Link className="person-link" href={`/person/${personId}`}>
                {personName}
              </Link>
              <br />
              {alerts.map((alert) => {
                return (
                  <>
                    {alert} <br />
                  </>
                );
              })}
            </Text>
          );
        })
      ) : (
        <Text size="sm">{cautionaryAlerts.none}</Text>
      )}
    </aside>
  );
};
