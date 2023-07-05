import React, { useEffect, useState } from "react";
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
import { PatchAssetRequest, getAsset, patchAsset } from "../add-boiler-house-form/utils";
import { ConfirmationModal } from "./confirmation-modal";

const { boilerHouse } = locale;

interface Props {
  assetId: string;
  asset: Asset;
}

export const BoilerHouseDetails = ({ assetId, asset }: Props) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isLoadingRemoveAssetRequest, setIsLoadingRemoveAssetRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const [boilerHouseAsset, setBoilerHouseAsset] = useState<Asset|null>(null)

  const assetHasBoilerHouse = () => asset.boilerHouseId !== "" && asset.boilerHouseId !== undefined

  useEffect(() => {
    // no boilerHouse to fetch
    if (!assetHasBoilerHouse()){
      // in case of state change
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    getAsset(asset.boilerHouseId)
      .then(res => {
        setBoilerHouseAsset(res.data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
      })
  }, [asset?.boilerHouseId])


  const handleRemoveBoilerHouse = () => {
    const request: PatchAssetRequest = {
      boilerHouseId: "",
    };

    setIsLoadingRemoveAssetRequest(true);

    patchAsset(assetId, request, asset?.versionNumber?.toString() || "")
      .then((res) => {
        setShowConfirmationModal(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoadingRemoveAssetRequest(false);
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
            <Button as={RouterLink} to={`/property/${assetId}/add-boiler-house`}>
              Add boiler house
            </Button>
          ) : (
            <>
              <Link as={RouterLink} to={`/property/${asset.boilerHouseId}`}>
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
