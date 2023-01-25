import React from "react";

import { locale } from "../../services";

import { Alert } from "@mtfh/common/lib/api/cautionary-alerts/v1/types";
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
  const alertsPerPersonWithoutPersonId: Record<
    string,
    {
      personName: string;
      alerts: string[];
    }
  > = {};

  alerts.forEach(({ personId, personName, description }) => {
    if (personId && personName) {
      if (alertsPerPerson[personId]) {
        alertsPerPerson[personId].alerts.push(description);
      } else {
        alertsPerPerson[personId] = {
          personName,
          alerts: [description],
        };
      }
    } else if (personName) {
      alertsPerPersonWithoutPersonId[description] = {
        personName,
        alerts: [description],
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
