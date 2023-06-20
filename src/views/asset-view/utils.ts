import { useEffect, useState } from "react";

import { getPropertyCautionaryAlerts } from "@mtfh/common/lib/api/cautionary-alerts/v1";
import { Alert } from "@mtfh/common/lib/api/cautionary-alerts/v1/types";

export const useCautionaryAlerts = (assetId: string, shouldLoad: boolean) => {
  const [isLoading, setIsLoading] = useState(true);
  const [alertsData, setAlertsData] = useState<Alert[]>([]);

  useEffect(() => {
    // cautionary alerts not used for current assetType
    if (!shouldLoad) {
      setIsLoading(false);
      return;
    }

    getPropertyCautionaryAlerts(assetId).then((res) => {
      setAlertsData(res?.alerts || []);
      // only set loading as false if successfully loaded data
      setIsLoading(false);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { alertsData, isLoading };
};
