import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";
import { ConfirmationModal } from "./confirmation-modal";
import { useBoilerHouseDetails } from "./hooks/useBoilerHouseDetails";
import { useConfirmRemoveModal } from "./hooks/useConfirmRemoveModal";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Button, Center, Heading, Link, Spinner } from "@mtfh/common/lib/components";

const { boilerHouse } = locale;

interface Props {
  asset: Asset;
}

export const BoilerHouseDetails = ({ asset }: Props) => {
  const { isLoading, boilerHouseAsset, assetHasBoilerHouse } =
    useBoilerHouseDetails(asset);

  const {
    isLoading: isLoadingRemoveAssetRequest,
    setShowModal,
    showModal,
    handleRemoveBoilerHouse,
  } = useConfirmRemoveModal(asset);

  return (
    <aside className="mtfh-cautionary-alerts">
      <ConfirmationModal
        showModal={showModal}
        hideModal={() => setShowModal(false)}
        onSubmit={handleRemoveBoilerHouse}
        isLoading={isLoadingRemoveAssetRequest}
      />

      <Heading variant="h2" className="lbh-heading lbh-heading-h3">
        {boilerHouse.boilerHouse}
      </Heading>

      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          {!assetHasBoilerHouse() ? (
            <Button as={RouterLink} to={`/property/${asset.id}/add-boiler-house`}>
              Add boiler house
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
                Remove boiler house
              </Button>
            </>
          )}
        </>
      )}
    </aside>
  );
};
