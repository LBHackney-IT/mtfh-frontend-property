import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale } from "../../services";
import { CautionaryAlertsDetails } from "./cautionary-alerts-details";

import { Alert } from "@mtfh/common/lib/api/cautionary-alerts/v1/types";

const { cautionaryAlerts } = locale;

const alert: Alert = {
  alertId: "1234",
  alertCode: "VA",
  assureReference: "",
  dateModified: "",
  description: "Verbal Abuse",
  endDate: null,
  modifiedBy: "",
  personName: "Joan Fisher",
  personId: "1",
  reason: "",
  startDate: "",
  isActive: true,
};

describe("CautionaryAlertsDetails", () => {
  it("should display cautionary alerts - no alerts", () => {
    render(<CautionaryAlertsDetails alerts={[]} />);
    expect(screen.getByText(cautionaryAlerts.cautionaryAlerts)).toBeInTheDocument();
    expect(screen.getByText(cautionaryAlerts.none)).toBeInTheDocument();
  });

  it.skip("should display cautionary alerts - 1 alert per person", () => {
    const alerts = [
      alert,
      {
        ...alert,
        personName: "Tom Fisher",
        personId: "2",
      },
    ];
    render(<CautionaryAlertsDetails alerts={alerts} />);
    expect(screen.getByText(cautionaryAlerts.cautionaryAlerts)).toBeInTheDocument();
    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
    expect(screen.getByText(alerts[0].personName!).getAttribute("href")).toBe(
      `/person/${alerts[0].personId}`,
    );
    expect(screen.getByText(alerts[1].personName!).getAttribute("href")).toBe(
      `/person/${alerts[1].personId}`,
    );
    expect(screen.getAllByText(alerts[0].description).length).toBe(2);
  });

  it.skip("should display cautionary alerts - 2 alerts per person", () => {
    const alerts = [
      alert,
      {
        ...alert,
        personName: "Tom Fisher",
        personId: "2",
      },
      {
        ...alert,
        personName: "Tom Fisher",
        personId: "2",
        description: "Physical Abuse",
      },
      {
        ...alert,
        description: "Physical Abuse",
        personId: "1",
      },
    ];
    render(<CautionaryAlertsDetails alerts={alerts} />);
    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
    expect(screen.getByText(alerts[0].personName!).getAttribute("href")).toBe(
      `/person/${alerts[0].personId}`,
    );
    expect(screen.getByText(alerts[1].personName!).getAttribute("href")).toBe(
      `/person/${alerts[1].personId}`,
    );
    expect(screen.getAllByText(alerts[0].description, { exact: false }).length).toBe(2);
    expect(screen.getAllByText(alerts[2].description, { exact: false }).length).toBe(2);
  });
});
