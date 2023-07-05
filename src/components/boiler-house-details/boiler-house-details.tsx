import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";

import {
  Alert as AlertIcon,
  Button,
  Center,
  Heading,
  Link,
  Spinner,
  Text,
} from "@mtfh/common/lib/components";
import { useAsset } from "@mtfh/common/lib/api/asset/v1";

// import "./cautionary-alerts.styles.scss";

const { boilerHouse } = locale;

interface Props {
  boilerHouseId: string;
  assetId: string;
}

export const BoilerHouseDetails = ({ boilerHouseId , assetId}: Props) => {
  const boilerHouseIsNull = boilerHouseId === null || boilerHouseId === "";

  const { data: boilerHouseAsset, ...assetRequest } = useAsset(boilerHouseId);

  const boilerHouseLoading = !boilerHouseIsNull && boilerHouseAsset === undefined;

  // const asset = {}

  const handleRemoveBoilerHouse = () => {
    if (!confirm("R u sure?")) return;
  };

  // if (!boilerHouseIsNull && asset === undefined) {
  //   return (
  //     <Center>
  //       <Spinner />
  //     </Center>
  //   );
  // }

  return (
    <aside className="mtfh-cautionary-alerts">
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
            <>
              <Button
              as={RouterLink} to={`/property/${assetId}/add-boiler-house`}
              >
                Add boiler house
              </Button>
            </>
          ) : (
            <>
              <Link as={RouterLink} to={`/property/${boilerHouseId}`}>
                {boilerHouseAsset?.assetAddress?.addressLine1}
              </Link>

              <Button onClick={handleRemoveBoilerHouse}>Remove boiler house</Button>
            </>
          )}
        </>
      )}
    </aside>
  );
};
