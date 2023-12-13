import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";
import { PropertyTree } from "../property-tree/property-tree";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Button, CommentList, WorkOrderList } from "@mtfh/common/lib/components";
import { useFeatureToggle } from "@mtfh/common/lib/hooks";

interface Props {
  assetDetails: Asset;
  childAssets: Asset[] | undefined;
  enableNewProcesses: boolean;
  id: string;
}

export const PropertyBody = ({
  assetDetails,
  childAssets,
  enableNewProcesses,
  id,
}: Props): JSX.Element => {
  const hasRepairsList = useFeatureToggle("MMH.RepairsList");

  return (
    <>
      <div id="property-body-grid-container">
        <div id="property-tree-grid-area">
          <PropertyTree asset={assetDetails} childAssets={childAssets} />
        </div>
        {enableNewProcesses && (
          <div id="new-process-grid-area">
            <Button
              variant="primary"
              as={RouterLink}
              to={`/processes/property/${assetDetails.id}`}
            >
              {locale.static.newProcess}
            </Button>
          </div>
        )}
        <div id="repairs-grid-area">
          {hasRepairsList && (
            <>
              <h2 className="lbh-heading-h2">{locale.repairs.heading}</h2>
              <WorkOrderList assetId={assetDetails.assetId} />
            </>
          )}
        </div>
        <div id="comments-grid-area">
          <h2 className="lbh-heading-h2">{locale.comments.heading}</h2>
          <Button as={RouterLink} to={`/comment/property/${assetDetails.id}`}>
            {locale.comments.addComment}
          </Button>
          <div>
            <CommentList targetId={assetDetails.id} />
          </div>
        </div>
        <div>
          <Button variant="secondary" as={RouterLink} to={`/activities/property/${id}`}>
            {locale.activityHistory.activityHistoryButtonLabel}
          </Button>
        </div>
      </div>
    </>
  );
};
