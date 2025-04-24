import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Cookies from "js-cookie";

import { locale } from "../../services";
import { patchAdminAuthGroups } from "../../services/config/config";
import {
  CancelReassignmentButton,
  ConfirmReassignmentButton,
  EditAssignmentButton,
} from "../patch-assignment-form/components/form-buttons";

import {
  UpdatePropertyPatchRequest,
  updatePropertyPatch,
  useAsset,
} from "@mtfh/common/lib/api/asset/v1";
import {
  Patch,
  getAllPatchesAndAreas,
  getByPatchName,
  usePatchOrArea,
} from "@mtfh/common/lib/api/patch/v1";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import {
  Button,
  Center,
  Heading,
  Spinner,
  SummaryList,
  SummaryListItem,
} from "@mtfh/common/lib/components";
import { ErrorSummary } from "@mtfh/common/lib/components";
import { AssetLayout } from "../../views/asset-view/layout";

interface PatchDetailsProps {
  assetPk: string;
  assetPatch?: Patch;
  assetArea?: Patch;
  versionNumber?: number;
}

export const buildUpdatePropertyPatchRequest = (
  patchId: string,
  areaId: string,
): UpdatePropertyPatchRequest => ({
  patchId,
  areaId,
});

function updatePropertyPatchCall(request: UpdatePropertyPatchRequest, assetPk: string, versionNumber: string) {
  updatePropertyPatch(assetPk, request, versionNumber?.toString() ?? "")
    .catch((err) => {
      console.error(err);
      <ErrorSummary
        id="mtfh-property-patch"
        title="Error" 
        description="Unable to update patch"
      />
    })
    .finally(() => {
        const { data: asset, ...assetRequest } = useAsset(assetPk);
        console.log(asset);
        if (assetRequest.error) {
          return (
            <ErrorSummary
              id="property-error"
              title={locale.errors.unableToFetchRecord}
              description={locale.errors.tryAgainOrContactSupport}
            />
          );
        }
        if (!asset) {
          return (
            <Center>
              <Spinner />
            </Center>
          );
        }
        const { data: assetPatch } = usePatchOrArea(asset.patchId);
        const { data: assetArea } = usePatchOrArea(asset.areaId);
        return (
          <PatchDetails
            assetPk={assetPk}
            assetPatch={assetPatch}
            assetArea={assetArea}
            versionNumber={asset.versionNumber}
          />
        );
      // useAsset(assetPk);
      // window.location.reload();
    });
};
export const PatchDetails = ({
  assetPk,
  assetPatch,
  assetArea,
  versionNumber,
}: PatchDetailsProps) => {
  const { heading } = locale.patchDetails;

  const { patchLabel, housingOfficerLabel, areaManagerLabel } = locale.patchDetails;

  const patchOrAreaDefined = assetPatch || assetArea;
  const housingOfficerName = assetPatch?.responsibleEntities[0]?.name;
  const areaManagerName = assetArea?.responsibleEntities[0]?.name;
  const [newPatchName, setNewPatchName] = useState<string>();
  const [isEditingPatchName, setIsEditingPatchName] = useState(false);
  const [patchesAndAreas, setPatchesAndAreas] = useState<Patch[]>([]);

  useEffect(() => {
    getAllPatchesAndAreas().then((data) => {
      data = data.filter(
          (patchOrArea) =>
            ![
              "Hackney",
              "CL Area",
              "CP Area",
              "HN1 Area",
              "HN2 Area",
              "SD Area",
              "SH Area",
              "SN Area",
            ].includes(patchOrArea.name),
        ),
        setPatchesAndAreas(data);
      });
  }, []);

  // const updatePropertyPatchCall = (request: UpdatePropertyPatchRequest) => {
  //   updatePropertyPatch(assetPk, request, versionNumber?.toString() ?? "")
  //     .catch((err) => {
  //       console.error(err);
  //       <ErrorSummary
  //         id="mtfh-property-patch"
  //         title="Error" 
  //         description="Unable to update patch"
  //       />
  //     })
  //     .finally(() => {
  //         const { data: asset, ...assetRequest } = useAsset(assetPk);
  //         console.log(asset);
  //         if (assetRequest.error) {
  //           return (
  //             <ErrorSummary
  //               id="property-error"
  //               title={locale.errors.unableToFetchRecord}
  //               description={locale.errors.tryAgainOrContactSupport}
  //             />
  //           );
  //         }
  //         if (!asset) {
  //           return (
  //             <Center>
  //               <Spinner />
  //             </Center>
  //           );
  //         }
          
  //       // useAsset(assetPk);
  //       // window.location.reload();
  //     });
  // };
  const getbyPatchNameCall = (patchName: string) => {
    getByPatchName(patchName)
      .then((data) => {
        const id = JSON.stringify(data).match(/"id":"(.*?)"/);
        const parentId = JSON.stringify(data).match(/"parentId":"(.*?)"/);
        console.log(id, parentId);
        // Extract the id and parentId from the data which will always be the second item in the array as the first item is a json object 
        // whereas the  second item is a string value
        if (!id?.[1] || !parentId?.[1]) {
          throw new Error("Invalid patch data: id or parentId is undefined");
        }
        const request = buildUpdatePropertyPatchRequest(id[1], parentId[1]);
        updatePropertyPatchCall(request, assetPk, versionNumber?.toString() ?? "");
      })
      .catch((err) => {
        console.error(err);
        <ErrorSummary
          id="mtfh-property-patch"
          title="Error" 
          description="Unable to update patch"
        />
      });
  };
  const handleEdit = () => {
    if (newPatchName) {
      getbyPatchNameCall(newPatchName);
    }
  };

  // function SetPatchNameOption() {
  //   return (
  //     <div className="patch" key="patchName">
  //       <select
  //         id="patch-dropdown-options"
  //         className="govuk-input lbh-input"
  //         data-testid="patch-dropdown-options"
  //         value={newPatchName}
  //         onChange={(e) => setNewPatchName(e.target.value)}
  //       >
  //         <option disabled value="">
  //           {" "}
  //           -- Select an option --{" "}
  //         </option>
  //         <option selected>{assetPatch?.name}</option>
  //         {patchesAndAreas
  //           .filter((patchOrArea) => patchOrArea.patchType === "patch")
  //           .sort((a, b) => (a.name > b.name ? 1 : -1))
  //           .map(({ name }) => (
  //             <option key={name} value={name}>
  //               {name}
  //             </option>
  //           ))}
  //       </select>
  //     </div>
  //   );
  // }

  return (
    <>
      <aside className="mtfh-patch-details">
        <Heading variant="h2" className="lbh-heading lbh-heading-h3">
          {heading}
        </Heading>

        {patchOrAreaDefined ? (
          <SummaryList overrides={[2 / 3]}>
            <SummaryListItem title={patchLabel} data-testid="patch-name" key="patchName">
              {assetPatch?.name}
            </SummaryListItem>
            <SummaryListItem
              title={housingOfficerLabel}
              data-testid="officer-name"
              key="officerName"
            >
              {housingOfficerName || "N/A"}
            </SummaryListItem>
            <SummaryListItem
              title={areaManagerLabel}
              data-testid="area-manager-name"
              key="areaManagerName"
            >
              {areaManagerName || "N/A"}
            </SummaryListItem>
          </SummaryList>
        ) : (
          <p>{locale.patchDetails.noPatch}</p>
        )}
        {isAuthorisedForGroups(patchAdminAuthGroups) &&
          (!isEditingPatchName ? (
            <EditAssignmentButton onClick={() => setIsEditingPatchName(true)} />
          ) : (
            <select
              id="patch-dropdown-options"
              className="govuk-input lbh-input"
              data-testid="patch-dropdown-options"
              value={newPatchName}
              onChange={(e) => setNewPatchName(e.target.value)}
            >
              <option disabled value="">
                {" "}
                -- Select an option --{" "}
              </option>
              <option selected>{assetPatch?.name}</option>
              {patchesAndAreas
                .filter((patchOrArea) => patchOrArea.patchType === "patch")
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
          ))}
        {isAuthorisedForGroups(patchAdminAuthGroups) && isEditingPatchName && (
          <ConfirmReassignmentButton onClick={handleEdit} enabled />
        )}
        {isAuthorisedForGroups(patchAdminAuthGroups) && isEditingPatchName && (
          <CancelReassignmentButton onClick={() => setIsEditingPatchName(false)} />
        )}
        <Button
          as={RouterLink}
          to="/property/all-patches-and-areas"
          data-testid="all-patches-and-areas-button"
          onClick={() => Cookies.set("fromAssetId", assetPk)}
        >
          {locale.patchDetails.allPatchesAndAreas}
        </Button>
      </aside>
      <hr className="lbh-horizontal-bar" />
    </>
  );
};
