import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";

import {
  Button,
  Center,
  Dialog,
  DialogActions,
  Heading,
  Link,
  Spinner,
} from "@mtfh/common/lib/components";
import { Asset, useAsset } from "@mtfh/common/lib/api/asset/v1";
import { PatchAssetRequest, patchAsset } from "../add-boiler-house-form/utils";
import { ConfirmationModal } from "./confirmation-modal";

const { boilerHouse } = locale;

interface Props {
  boilerHouseId: string;
  assetId: string;
  asset: Asset;
}

export const BoilerHouseDetails = ({ boilerHouseId, assetId, asset }: Props) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const boilerHouseIsNull = boilerHouseId === null || boilerHouseId === "";

  const { data: boilerHouseAsset } = useAsset(boilerHouseId);

  const boilerHouseLoading = !boilerHouseIsNull && boilerHouseAsset === undefined;

  const handleRemoveBoilerHouse = () => {
    const request: PatchAssetRequest = {
      boilerHouseId: "",
    };

    setIsLoading(true);

    patchAsset(assetId, request, asset?.versionNumber?.toString() || "")
      .then((res) => {
        console.log({ res });

        // success
        setShowConfirmationModal(false);

        // lazy way to update asset
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const showModalConfirmation = () => {
    setShowConfirmationModal(true);
  };

  return (
    <aside className="mtfh-cautionary-alerts">
      <ConfirmationModal
        showModal={showConfirmationModal}
        hideModal={() => setShowConfirmationModal(false)}
        onSubmit={handleRemoveBoilerHouse}
        isLoading={isLoading}
      />

      <Heading variant="h2" className="lbh-heading lbh-heading-h3">
        {boilerHouse.boilerHouse}
      </Heading>

      {boilerHouseLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          {boilerHouseIsNull ? (
            <Button as={RouterLink} to={`/property/${assetId}/add-boiler-house`}>
              Add boiler house
            </Button>
          ) : (
            <>
              <Link as={RouterLink} to={`/property/${boilerHouseId}`}>
                {boilerHouseAsset?.assetAddress?.addressLine1}
              </Link>

              <Button onClick={showModalConfirmation}>Remove boiler house</Button>
            </>
          )}
        </>
      )}
    </aside>
  );
};
