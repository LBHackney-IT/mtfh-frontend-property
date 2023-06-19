import { useEffect, useState } from "react";

import { axiosInstance } from "@mtfh/common";
import { Alert, CautionaryAlert } from "@mtfh/common/lib/api/cautionary-alerts/v1/types";
import { config } from "@mtfh/common/lib/config";

const getCautionaryAlerts = async (assetId: string) => {
  return axiosInstance.get<CautionaryAlert>(
    `${config.cautionaryApiUrlV1}/cautionary-alerts/properties-new/${assetId}`,
  );
};

export const useCautionaryAlerts = (assetId: string, shouldLoad: boolean) => {
  const [isLoading, setIsLoading] = useState(true);
  const [alertsData, setAlertsData] = useState<Alert[]>([]);

  useEffect(() => {
    // cautionary alerts not used for current assetType
    if (!shouldLoad) {
      setIsLoading(false);
      return;
    }

    getCautionaryAlerts(assetId)
      .then((res) => {
        setAlertsData(res?.data?.alerts || []);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { alertsData, isLoading };
};
