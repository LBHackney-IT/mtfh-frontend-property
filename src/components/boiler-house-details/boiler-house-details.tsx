import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";
import { ConfirmationModal } from "./confirmation-modal";
import { useBoilerHouseDetails } from "./hooks/useBoilerHouseDetails";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Button, Center, Heading, Link, Spinner } from "@mtfh/common/lib/components";

interface Props {
  asset: Asset;
}

export const BoilerHouseDetails = ({ asset }: Props) => {
  const { isLoading, boilerHouseAsset, assetHasBoilerHouse } =
    useBoilerHouseDetails(asset);

  const [showModal, setShowModal] = useState(false);

  return (
    <aside className="mtfh-cautionary-alerts">
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
            <Button as={RouterLink} to={`/property/${asset.id}/add-boiler-house`}>
              {locale.boilerHouseDetails.addBoilerHouseButton}
            </Button>
          ) : (
            <>
              <Link as={RouterLink} to={`/property/${asset.boilerHouseId}`}>
                {boilerHouseAsset?.assetAddress?.addressLine1}
              </Link>

              <Button
                data-testid="remove-boiler-house-button"
                onClick={() => setShowModal(true)}
              >
                {locale.boilerHouseDetails.removeBoilerHouseButton}
              </Button>
            </>
          )}
        </>
      )}
    </aside>
  );
};
