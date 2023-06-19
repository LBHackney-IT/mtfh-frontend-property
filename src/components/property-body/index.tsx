import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Alert } from "@mtfh/common/lib/api/cautionary-alerts/v1/types";
import {
  Button,
  CommentList,
  Heading,
  Link,
  WorkOrderList,
} from "@mtfh/common/lib/components";
import { useFeatureToggle } from "@mtfh/common/lib/hooks";
import { PropertyTree } from "../../utils/property-tree";

interface Props {
  ssetDetails: Asset;
  childAssets: Asset[] | undefined;
}

export const PropertyBody = ({ assetDetails, childAssets }: Props): JSX.Element => {
  const hasRepairsList = useFeatureToggle("MMH.RepairsList");

  return (
    <>
    <div id="property-body-grid-container">
      <div id="property-tree-grid-area">
        <PropertyTree asset={assetDetails} childAssets={childAssets} />
      </div>
      <div id="new-process-grid-area">
        <Button
          variant="primary"
          as={RouterLink}
          to={`/processes/property/${assetDetails.id}`}
        >
          {locale.static.newProcess}
        </Button>
      </div>
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
    </div>
  </>
  );
};
