import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";
import { assetAdminAuthGroups } from "../../services/config/config";
import { ConfirmationModal } from "./confirmation-modal";

import { isAuthorisedForGroups } from "@mtfh/common";
import { Asset, getAsset } from "@mtfh/common/lib/api/asset/v1";
import {
  Button,
  Center,
  Heading,
  Link,
  Spinner,
  Text,
} from "@mtfh/common/lib/components";

interface Props {
  asset: Asset;
}

export const BoilerHouseDetails = ({ asset }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [boilerHouseAsset, setBoilerHouseAsset] = useState<Asset | null>(null);

  const assetHasBoilerHouse = () =>
    asset.boilerHouseId !== "" && asset.boilerHouseId !== undefined;

  useEffect(() => {
    // no boilerHouse to fetch
    if (!assetHasBoilerHouse()) {
      // in case of state change
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getAsset(asset.boilerHouseId)
      .then((res) => {
        setBoilerHouseAsset(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset?.boilerHouseId]);

  return (
    <aside className="mtfh-boiler-house">
      <ConfirmationModal
        asset={asset}
        showModal={showModal}
        setShowModal={setShowModal}
      />

      <Heading variant="h2" className="lbh-heading lbh-heading-h3">
        {locale.boilerHouseDetails.heading}
      </Heading>

      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          {!assetHasBoilerHouse() ? (
            <>
              {isAuthorisedForGroups(assetAdminAuthGroups) ? (
                <Button as={RouterLink} to={`/property/${asset.id}/add-boiler-house`}>
                  {locale.boilerHouseDetails.addBoilerHouseButton}
                </Button>
              ) : (
                <Text size="sm">None</Text>
              )}
            </>
          ) : (
            <>
              <Link as={RouterLink} to={`/property/${asset.boilerHouseId}`}>
                {boilerHouseAsset?.assetAddress?.addressLine1}
              </Link>

              {isAuthorisedForGroups(assetAdminAuthGroups) && (
                <Button
                  data-testid="remove-boiler-house-button"
                  onClick={() => setShowModal(true)}
                >
                  {locale.boilerHouseDetails.removeBoilerHouseButton}
                </Button>
              )}
            </>
          )}
        </>
      )}
      <hr className="lbh-horizontal-bar" />
    </aside>
  );
};
